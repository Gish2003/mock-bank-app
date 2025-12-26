# ⚡ QUICK START GUIDE - Mock Banking App

**Time to complete: ~10 minutes**

---

## 📋 PRE-REQUISITES

Make sure you have installed:
- **Node.js** (v14 or higher) - Download from https://nodejs.org
- **Git** - Download from https://git-scm.com
- **GitHub Account** - Sign up at https://github.com

---

## 🚀 STEP-BY-STEP SETUP

### STEP 1: Extract & Navigate to Project

```bash
# Navigate to the project folder
cd mock-banking-app
```

### STEP 2: Install Dependencies

```bash
npm install
```

This will install all required packages (Express, SQLite, JWT, etc.)

### STEP 3: Initialize Database

```bash
npm run init-db
```

✅ This creates the database with 3 sample users ready to use!

### STEP 4: Start the Server

```bash
npm start
```

✅ Server is now running on http://localhost:3000

**Keep this terminal window open!**

---

## 🧪 TEST THE API (Optional but Recommended)

Open a **NEW terminal window** and run:

```bash
# Make sure you're in the project folder
cd mock-banking-app

# Run the test script
node test-api.js
```

You should see:
- ✅ Login successful
- ✅ Balance retrieved
- ✅ Money sent successfully
- ✅ Transaction history retrieved

---

## 📤 PUSH TO GITHUB

### Create Repository on GitHub:

1. Go to https://github.com
2. Click the **"+"** icon (top right) → **"New repository"**
3. Repository name: `mock-banking-app`
4. Choose **Public** or **Private**
5. **Do NOT check** any boxes (no README, .gitignore, or license)
6. Click **"Create repository"**
7. **Copy the repository URL** (e.g., `https://github.com/yourusername/mock-banking-app.git`)

### Push Your Code:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Mock banking application"

# Add your GitHub repository (replace with YOUR URL)
git remote add origin https://github.com/YOUR_USERNAME/mock-banking-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### If Authentication Required:

You'll need a **Personal Access Token** instead of password:

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token → Select `repo` scope
3. Copy the token
4. Use it as your password when prompted

---

## 🎯 SAMPLE USER CREDENTIALS

Use these to test the application:

| Username    | Password     | Account Number | Initial Balance |
|-------------|--------------|----------------|-----------------|
| john_doe    | password123  | ACC1001        | $5,000.00      |
| jane_smith  | password456  | ACC1002        | $3,500.00      |
| bob_wilson  | password789  | ACC1003        | $10,000.00     |

---

## 📡 API ENDPOINTS QUICK REFERENCE

### Authentication (No token required)

**Login:**
```bash
POST http://localhost:3000/api/auth/login
Body: {"username": "john_doe", "password": "password123"}
```

**Register:**
```bash
POST http://localhost:3000/api/auth/register
Body: {
  "username": "newuser",
  "email": "new@example.com",
  "password": "password123",
  "full_name": "New User"
}
```

### Account (Requires token)

**Get Balance:**
```bash
GET http://localhost:3000/api/account/balance
Header: Authorization: Bearer YOUR_TOKEN
```

**Get Details:**
```bash
GET http://localhost:3000/api/account/details
Header: Authorization: Bearer YOUR_TOKEN
```

### Transactions (Requires token)

**Send Money:**
```bash
POST http://localhost:3000/api/transactions/send
Header: Authorization: Bearer YOUR_TOKEN
Body: {
  "toAccountNumber": "ACC1002",
  "amount": 500,
  "description": "Payment"
}
```

**Transaction History:**
```bash
GET http://localhost:3000/api/transactions/history
Header: Authorization: Bearer YOUR_TOKEN
```

---

## 🛠️ TESTING WITH CURL

### 1. Login to get token:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"password123"}'
```

Copy the `token` from the response.

### 2. Check balance:
```bash
curl http://localhost:3000/api/account/balance \
  -H "Authorization: Bearer PASTE_YOUR_TOKEN_HERE"
```

### 3. Send money:
```bash
curl -X POST http://localhost:3000/api/transactions/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PASTE_YOUR_TOKEN_HERE" \
  -d '{"toAccountNumber":"ACC1002","amount":100,"description":"Test"}'
```

---

## 📁 PROJECT STRUCTURE

```
mock-banking-app/
├── config/
│   └── database.js          # Database connection
├── middleware/
│   └── auth.js              # JWT authentication
├── routes/
│   ├── auth.js              # Login/Register
│   ├── account.js           # Account info
│   └── transactions.js      # Send money, history
├── scripts/
│   └── initDatabase.js      # Database setup
├── database/                # Created after init-db
│   └── banking.db          
├── server.js                # Main server
├── package.json             
├── .env                     # Config
└── README.md               
```

---

## ✅ VERIFICATION CHECKLIST

- [ ] Node.js installed
- [ ] Git installed
- [ ] Dependencies installed (`npm install`)
- [ ] Database initialized (`npm run init-db`)
- [ ] Server running (`npm start`)
- [ ] API tested (login works)
- [ ] Code pushed to GitHub

---

## 🆘 TROUBLESHOOTING

**Server won't start?**
- Check if port 3000 is already in use
- Change PORT in `.env` file

**Database error?**
- Run `npm run init-db` again
- Delete `database/banking.db` and re-initialize

**GitHub push fails?**
- Make sure you created the repository on GitHub first
- Check your repository URL is correct
- Use Personal Access Token, not password

**Need help?**
- Check README.md for detailed documentation
- All endpoints documented with examples

---

## 🎉 YOU'RE DONE!

Your mock banking application is ready! The backend is running and code is on GitHub.

**Next Steps:**
- Test all 4 features (login, send, receive, history)
- Show your instructor/client
- Build a frontend if needed later

**Time saved:** Instead of coding for hours, you completed this in ~10 minutes! 🚀
