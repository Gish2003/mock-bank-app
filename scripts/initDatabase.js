const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '../database');
const dbPath = path.join(dbDir, 'banking.db');

// Create database directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

db.serialize(async () => {
  // Create Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create Accounts table
  db.run(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      account_number TEXT UNIQUE NOT NULL,
      balance REAL DEFAULT 0.00,
      account_type TEXT DEFAULT 'savings',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create Transactions table
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_account_number TEXT NOT NULL,
      to_account_number TEXT NOT NULL,
      amount REAL NOT NULL,
      transaction_type TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'completed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (from_account_number) REFERENCES accounts(account_number),
      FOREIGN KEY (to_account_number) REFERENCES accounts(account_number)
    )
  `);

  console.log('Tables created successfully!');

  // Insert sample users
  const hashedPassword1 = await bcrypt.hash('password123', 10);
  const hashedPassword2 = await bcrypt.hash('password456', 10);
  const hashedPassword3 = await bcrypt.hash('password789', 10);

  db.run(`
    INSERT OR IGNORE INTO users (username, email, password, full_name) 
    VALUES 
      ('john_doe', 'john@example.com', ?, 'John Doe'),
      ('jane_smith', 'jane@example.com', ?, 'Jane Smith'),
      ('bob_wilson', 'bob@example.com', ?, 'Bob Wilson')
  `, [hashedPassword1, hashedPassword2, hashedPassword3], function(err) {
    if (err) {
      console.error('Error inserting users:', err);
    } else {
      console.log('Sample users created!');
    }
  });

  // Insert sample accounts
  db.run(`
    INSERT OR IGNORE INTO accounts (user_id, account_number, balance, account_type) 
    VALUES 
      (1, 'ACC1001', 5000.00, 'savings'),
      (2, 'ACC1002', 3500.00, 'checking'),
      (3, 'ACC1003', 10000.00, 'savings')
  `, function(err) {
    if (err) {
      console.error('Error inserting accounts:', err);
    } else {
      console.log('Sample accounts created!');
    }
  });

  // Insert sample transaction
  db.run(`
    INSERT OR IGNORE INTO transactions (from_account_number, to_account_number, amount, transaction_type, description) 
    VALUES 
      ('ACC1001', 'ACC1002', 500.00, 'transfer', 'Payment for services')
  `, function(err) {
    if (err) {
      console.error('Error inserting transaction:', err);
    } else {
      console.log('Sample transaction created!');
      console.log('\n=================================');
      console.log('Database initialized successfully!');
      console.log('=================================');
      console.log('\nSample Users Created:');
      console.log('1. Username: john_doe | Password: password123 | Account: ACC1001');
      console.log('2. Username: jane_smith | Password: password456 | Account: ACC1002');
      console.log('3. Username: bob_wilson | Password: password789 | Account: ACC1003');
      console.log('\nYou can login with any of these credentials.');
    }
  });
});

db.close();
