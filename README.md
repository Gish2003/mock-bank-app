# Mock Banking Application - Backend

A RESTful API backend for a mock online banking system built with Node.js, Express, and SQLite.

## Features

✅ User Authentication (Register/Login with JWT)  
✅ Account Management  
✅ Send Money (Transfer funds)  
✅ Receive Money (Automatic when someone sends to your account)  
✅ Transaction History  
✅ Secure password hashing with bcrypt  
✅ JWT-based authentication  
✅ SQLite database

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Initialize Database

```bash
npm run init-db
```

This creates the database with sample users:
- **Username:** john_doe | **Password:** password123 | **Account:** ACC1001
- **Username:** jane_smith | **Password:** password456 | **Account:** ACC1002
- **Username:** bob_wilson | **Password:** password789 | **Account:** ACC1003

### 3. Start Server

```bash
npm start
```

Server runs on: `http://localhost:3000`

---

## API Endpoints

### Authentication

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "full_name": "New User"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": 4,
    "username": "newuser",
    "email": "newuser@example.com",
    "full_name": "New User",
    "accountNumber": "ACC1004",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "accountNumber": "ACC1001",
    "balance": 5000.00,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Account Management

**Note:** All account endpoints require authentication. Include the token in the header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Account Details
```http
GET /api/account/details
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accountNumber": "ACC1001",
    "balance": 5000.00,
    "accountType": "savings",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "createdAt": "2025-01-01 10:00:00"
  }
}
```

#### Get Account Balance
```http
GET /api/account/balance
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accountNumber": "ACC1001",
    "balance": 5000.00
  }
}
```

---

### Transactions

#### Send Money
```http
POST /api/transactions/send
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "toAccountNumber": "ACC1002",
  "amount": 500.00,
  "description": "Payment for services"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Money sent successfully",
  "data": {
    "transactionId": 1,
    "fromAccount": "ACC1001",
    "toAccount": "ACC1002",
    "amount": 500.00,
    "newBalance": 4500.00,
    "description": "Payment for services",
    "timestamp": "2025-12-26T10:30:00.000Z"
  }
}
```

#### Get Transaction History
```http
GET /api/transactions/history
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accountNumber": "ACC1001",
    "transactions": [
      {
        "transactionId": 1,
        "type": "sent",
        "fromAccount": "ACC1001",
        "toAccount": "ACC1002",
        "amount": 500.00,
        "description": "Payment for services",
        "status": "completed",
        "timestamp": "2025-12-26 10:30:00"
      }
    ],
    "totalTransactions": 1
  }
}
```

#### Get Specific Transaction
```http
GET /api/transactions/5
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": 5,
    "type": "sent",
    "fromAccount": "ACC1001",
    "toAccount": "ACC1002",
    "amount": 500.00,
    "description": "Payment for services",
    "status": "completed",
    "timestamp": "2025-12-26 10:30:00"
  }
}
```

---

## Testing with cURL

### Login Example
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"password123"}'
```

### Send Money Example
```bash
curl -X POST http://localhost:3000/api/transactions/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"toAccountNumber":"ACC1002","amount":100,"description":"Test transfer"}'
```

### Get Balance Example
```bash
curl http://localhost:3000/api/account/balance \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Testing with Postman

1. **Import** these endpoints into Postman
2. **Login** first to get your JWT token
3. **Copy the token** from the login response
4. **Add to Authorization** header in other requests as: `Bearer YOUR_TOKEN`

---

## Database Schema

### Users Table
- id (Primary Key)
- username (Unique)
- email (Unique)
- password (Hashed)
- full_name
- created_at

### Accounts Table
- id (Primary Key)
- user_id (Foreign Key → Users)
- account_number (Unique)
- balance
- account_type
- created_at

### Transactions Table
- id (Primary Key)
- from_account_number (Foreign Key → Accounts)
- to_account_number (Foreign Key → Accounts)
- amount
- transaction_type
- description
- status
- created_at

---

## Project Structure

```
mock-banking-app/
├── config/
│   └── database.js          # Database connection
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── account.js           # Account management routes
│   └── transactions.js      # Transaction routes
├── scripts/
│   └── initDatabase.js      # Database initialization
├── database/
│   └── banking.db           # SQLite database (created after init)
├── .env                     # Environment variables
├── package.json             # Dependencies
├── server.js                # Main server file
└── README.md                # This file
```

---

## Environment Variables

Create a `.env` file (already included):

```env
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

---

## Security Notes

⚠️ **This is a MOCK application for demonstration purposes only!**

For production use, you should:
- Use a strong JWT_SECRET
- Implement rate limiting
- Add input validation and sanitization
- Use HTTPS
- Implement proper error handling
- Add logging and monitoring
- Use a production-grade database (PostgreSQL, MySQL)
- Implement transaction rollback mechanisms
- Add 2FA authentication
- Implement account verification

---


