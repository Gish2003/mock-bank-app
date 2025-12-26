const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Send money (transfer)
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { toAccountNumber, amount, description } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!toAccountNumber || !amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Recipient account number and amount are required' 
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount must be greater than zero' 
      });
    }

    // Get sender's account
    const senderAccount = await db.get(
      'SELECT * FROM accounts WHERE user_id = ?',
      [userId]
    );

    if (!senderAccount) {
      return res.status(404).json({ 
        success: false, 
        message: 'Sender account not found' 
      });
    }

    // Check if sending to own account
    if (senderAccount.account_number === toAccountNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot send money to your own account' 
      });
    }

    // Check sufficient balance
    if (senderAccount.balance < amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient balance' 
      });
    }

    // Get recipient's account
    const recipientAccount = await db.get(
      'SELECT * FROM accounts WHERE account_number = ?',
      [toAccountNumber]
    );

    if (!recipientAccount) {
      return res.status(404).json({ 
        success: false, 
        message: 'Recipient account not found' 
      });
    }

    // Perform transaction (deduct from sender)
    await db.run(
      'UPDATE accounts SET balance = balance - ? WHERE account_number = ?',
      [amount, senderAccount.account_number]
    );

    // Add to recipient
    await db.run(
      'UPDATE accounts SET balance = balance + ? WHERE account_number = ?',
      [amount, toAccountNumber]
    );

    // Record transaction
    const transactionResult = await db.run(
      `INSERT INTO transactions 
       (from_account_number, to_account_number, amount, transaction_type, description, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [senderAccount.account_number, toAccountNumber, amount, 'transfer', description || 'Money transfer', 'completed']
    );

    // Get updated balance
    const updatedAccount = await db.get(
      'SELECT balance FROM accounts WHERE user_id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'Money sent successfully',
      data: {
        transactionId: transactionResult.id,
        fromAccount: senderAccount.account_number,
        toAccount: toAccountNumber,
        amount: amount,
        newBalance: updatedAccount.balance,
        description: description || 'Money transfer',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error sending money:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during transaction' 
    });
  }
});

// Get transaction history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user's account
    const account = await db.get(
      'SELECT account_number FROM accounts WHERE user_id = ?',
      [userId]
    );

    if (!account) {
      return res.status(404).json({ 
        success: false, 
        message: 'Account not found' 
      });
    }

    // Get all transactions (sent and received)
    const transactions = await db.all(
      `SELECT * FROM transactions 
       WHERE from_account_number = ? OR to_account_number = ? 
       ORDER BY created_at DESC`,
      [account.account_number, account.account_number]
    );

    // Format transactions
    const formattedTransactions = transactions.map(tx => {
      const isSent = tx.from_account_number === account.account_number;
      return {
        transactionId: tx.id,
        type: isSent ? 'sent' : 'received',
        fromAccount: tx.from_account_number,
        toAccount: tx.to_account_number,
        amount: tx.amount,
        description: tx.description,
        status: tx.status,
        timestamp: tx.created_at
      };
    });

    res.json({
      success: true,
      data: {
        accountNumber: account.account_number,
        transactions: formattedTransactions,
        totalTransactions: formattedTransactions.length
      }
    });
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Get specific transaction details
router.get('/:transactionId', authMiddleware, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user.userId;

    // Get user's account
    const account = await db.get(
      'SELECT account_number FROM accounts WHERE user_id = ?',
      [userId]
    );

    if (!account) {
      return res.status(404).json({ 
        success: false, 
        message: 'Account not found' 
      });
    }

    // Get transaction
    const transaction = await db.get(
      `SELECT * FROM transactions 
       WHERE id = ? AND (from_account_number = ? OR to_account_number = ?)`,
      [transactionId, account.account_number, account.account_number]
    );

    if (!transaction) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transaction not found' 
      });
    }

    const isSent = transaction.from_account_number === account.account_number;

    res.json({
      success: true,
      data: {
        transactionId: transaction.id,
        type: isSent ? 'sent' : 'received',
        fromAccount: transaction.from_account_number,
        toAccount: transaction.to_account_number,
        amount: transaction.amount,
        description: transaction.description,
        status: transaction.status,
        timestamp: transaction.created_at
      }
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
