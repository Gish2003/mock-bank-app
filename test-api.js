// Quick API Test Script
// Run this after starting the server to test all endpoints

const testAPI = async () => {
  const baseURL = 'http://localhost:3000';
  let token = '';

  console.log('🧪 Starting API Tests...\n');

  // Test 1: Login
  console.log('1️⃣ Testing Login...');
  try {
    const loginResponse = await fetch(`${baseURL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'john_doe',
        password: 'password123'
      })
    });
    const loginData = await loginResponse.json();
    
    if (loginData.success) {
      token = loginData.data.token;
      console.log('✅ Login successful!');
      console.log(`   Account: ${loginData.data.accountNumber}`);
      console.log(`   Balance: $${loginData.data.balance}\n`);
    } else {
      console.log('❌ Login failed:', loginData.message, '\n');
      return;
    }
  } catch (error) {
    console.log('❌ Login error:', error.message, '\n');
    return;
  }

  // Test 2: Get Account Balance
  console.log('2️⃣ Testing Get Balance...');
  try {
    const balanceResponse = await fetch(`${baseURL}/api/account/balance`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const balanceData = await balanceResponse.json();
    
    if (balanceData.success) {
      console.log('✅ Balance retrieved!');
      console.log(`   Balance: $${balanceData.data.balance}\n`);
    } else {
      console.log('❌ Balance retrieval failed:', balanceData.message, '\n');
    }
  } catch (error) {
    console.log('❌ Balance error:', error.message, '\n');
  }

  // Test 3: Send Money
  console.log('3️⃣ Testing Send Money...');
  try {
    const sendResponse = await fetch(`${baseURL}/api/transactions/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        toAccountNumber: 'ACC1002',
        amount: 100,
        description: 'Test transfer'
      })
    });
    const sendData = await sendResponse.json();
    
    if (sendData.success) {
      console.log('✅ Money sent successfully!');
      console.log(`   Amount: $${sendData.data.amount}`);
      console.log(`   To: ${sendData.data.toAccount}`);
      console.log(`   New Balance: $${sendData.data.newBalance}\n`);
    } else {
      console.log('❌ Send money failed:', sendData.message, '\n');
    }
  } catch (error) {
    console.log('❌ Send money error:', error.message, '\n');
  }

  // Test 4: Transaction History
  console.log('4️⃣ Testing Transaction History...');
  try {
    const historyResponse = await fetch(`${baseURL}/api/transactions/history`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const historyData = await historyResponse.json();
    
    if (historyData.success) {
      console.log('✅ Transaction history retrieved!');
      console.log(`   Total Transactions: ${historyData.data.totalTransactions}`);
      if (historyData.data.transactions.length > 0) {
        console.log('   Latest transaction:');
        const latest = historyData.data.transactions[0];
        console.log(`     Type: ${latest.type}`);
        console.log(`     Amount: $${latest.amount}`);
        console.log(`     Description: ${latest.description}\n`);
      }
    } else {
      console.log('❌ History retrieval failed:', historyData.message, '\n');
    }
  } catch (error) {
    console.log('❌ History error:', error.message, '\n');
  }

  console.log('✨ All tests completed!\n');
};

// Run tests
testAPI().catch(console.error);
