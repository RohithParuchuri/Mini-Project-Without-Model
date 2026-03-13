/**
 * Debug Script - Test Backend API
 * Run with: node debug.js
 */

require('dotenv').config();
const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000/api';

async function testBackend() {
  console.log('🔍 Testing CyberGuard Backend...\n');

  // Test 1: Check if backend is running
  console.log('1️⃣ Checking if backend is running...');
  try {
    const response = await fetch(`${API_URL}/health`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend is running!');
      console.log(`   Response: ${JSON.stringify(data, null, 2)}\n`);
    } else {
      console.log(`❌ Backend returned status ${response.status}\n`);
    }
  } catch (error) {
    console.log(`❌ Backend is NOT running!\n`);
    console.log(`   Error: ${error.message}\n`);
    console.log('   ⚠️  Start backend with: cd backend && npm run dev\n');
    return;
  }

  // Test 2: Test login endpoint
  console.log('2️⃣ Testing login endpoint...');
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'hello@gmail.com',
        password: '12345678Aa@',
      }),
    });

    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(data, null, 2)}\n`);

    if (response.ok) {
      console.log('✅ Login successful!');
    } else {
      console.log(`❌ Login failed: ${data.message}`);
    }
  } catch (error) {
    console.log(`❌ Login endpoint error!\n`);
    console.log(`   Error: ${error.message}\n`);
  }

  // Test 3: Check environment variables
  console.log('3️⃣ Checking environment variables...');
  console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ NOT SET'}`);
  console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ NOT SET'}`);
  console.log(`   PORT: ${process.env.PORT || 5000}`);
  console.log();
}

testBackend();
