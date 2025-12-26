const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get account details
router.get('/details', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const account = await db.get(
      `SELECT a.*, u.username, u.email, u.full_name 
       FROM accounts a 
       JOIN users u ON a.user_id = u.id 
       WHERE a.user_id = ?`,
      [userId]
    );

    if (!account) {
      return res.status(404).json({ 
        success: false, 
        message: 'Account not found' 
      });
    }

    res.json({
      success: true,
      data: {
        accountNumber: account.account_number,
        balance: account.balance,
        accountType: account.account_type,
        username: account.username,
        email: account.email,
        fullName: account.full_name,
        createdAt: account.created_at
      }
    });
  } catch (error) {
    console.error('Error fetching account details:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Get account balance
router.get('/balance', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const account = await db.get(
      'SELECT account_number, balance FROM accounts WHERE user_id = ?',
      [userId]
    );

    if (!account) {
      return res.status(404).json({ 
        success: false, 
        message: 'Account not found' 
      });
    }

    res.json({
      success: true,
      data: {
        accountNumber: account.account_number,
        balance: account.balance
      }
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
