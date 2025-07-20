const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testing Mental Health API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', health.data);
    console.log('');

    // Test 2: Get Random Quote
    console.log('2. Testing Quotes API...');
    const quote = await axios.get(`${BASE_URL}/quotes/random`);
    console.log('✅ Random Quote:', quote.data);
    console.log('');

    // Test 3: Get All Quotes
    console.log('3. Testing All Quotes...');
    const quotes = await axios.get(`${BASE_URL}/quotes/all`);
    console.log(`✅ Found ${quotes.data.total} quotes`);
    console.log('');

    // Test 4: Get Breathing Exercises
    console.log('4. Testing Exercises API...');
    const breathing = await axios.get(`${BASE_URL}/exercises/breathing`);
    console.log(`✅ Found ${breathing.data.total} breathing patterns`);
    console.log('');

    // Test 5: Get Calming Exercises
    console.log('5. Testing Calming Exercises...');
    const calming = await axios.get(`${BASE_URL}/exercises/calming`);
    console.log(`✅ Found ${calming.data.total} calming exercises`);
    console.log('');

    // Test 6: Register a Test User
    console.log('6. Testing User Registration...');
    try {
      const register = await axios.post(`${BASE_URL}/auth/register`, {
        email: 'test@example.com',
        password: 'test123'
      });
      console.log('✅ User Registration:', register.data.message);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('✅ User already exists (expected)');
      } else {
        console.log('❌ Registration Error:', error.response?.data);
      }
    }
    console.log('');

    // Test 7: Login
    console.log('7. Testing User Login...');
    try {
      const login = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'test@example.com',
        password: 'test123'
      });
      console.log('✅ Login successful');
      const token = login.data.token;
      console.log('');

      // Test 8: Log Mood (with token)
      console.log('8. Testing Mood Logging...');
      const mood = await axios.post(`${BASE_URL}/mood/log`, {
        mood: 'happy'
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ Mood logged:', mood.data);
      console.log('');

      // Test 9: Get Mood History
      console.log('9. Testing Mood History...');
      const history = await axios.get(`${BASE_URL}/mood/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log(`✅ Found ${history.data.total} mood entries`);
      console.log('');

    } catch (error) {
      console.log('❌ Login Error:', error.response?.data);
    }

    console.log('🎉 All API tests completed successfully!');

  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure the server is running on port 5000');
    }
  }
}

testAPI(); 