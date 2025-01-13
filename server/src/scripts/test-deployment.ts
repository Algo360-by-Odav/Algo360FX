import axios from 'axios';

const BASE_URL = 'https://algo360fx-server.onrender.com';

async function testDeployment() {
  try {
    console.log('Testing deployment status...');
    console.log('Base URL:', BASE_URL);

    // Test root endpoint
    console.log('\nTesting root endpoint...');
    try {
      const rootResponse = await axios.get(BASE_URL);
      console.log('Root endpoint:', rootResponse.data);
    } catch (error: any) {
      console.log('Root endpoint error:', error.message);
      if (error.response) {
        console.log('Root endpoint status:', error.response.status);
      }
    }

    // Test health endpoint
    console.log('\nTesting health endpoint...');
    try {
      const healthResponse = await axios.get(`${BASE_URL}/api/health`);
      console.log('Health endpoint:', healthResponse.data);
    } catch (error: any) {
      console.log('Health endpoint error:', error.message);
      if (error.response) {
        console.log('Health endpoint status:', error.response.status);
      }
    }

    // Test auth endpoints
    console.log('\nTesting auth endpoints...');
    const testUser = {
      email: `test${Date.now()}@example.com`, // Unique email
      password: 'Test123!',
      username: `testuser${Date.now()}`, // Unique username
      firstName: 'Test',
      lastName: 'User',
      verificationCode: '123456' // This should match what's expected in production
    };

    // Test register
    console.log('\nTesting registration...');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
      console.log('Register response:', registerResponse.data);

      // Test login with registered user
      console.log('\nTesting login with registered user...');
      const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('Login response:', loginResponse.data);

      if (loginResponse.data.token) {
        // Test protected endpoint
        console.log('\nTesting protected endpoint...');
        const userResponse = await axios.get(`${BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${loginResponse.data.token}`
          }
        });
        console.log('Protected endpoint response:', userResponse.data);
      }
    } catch (error: any) {
      console.log('Auth endpoint error:', error.message);
      if (error.response) {
        console.log('Auth endpoint status:', error.response.status);
        console.log('Auth endpoint data:', error.response.data);
      }
    }

  } catch (error: any) {
    console.error('General error:', error.message);
  }
}

testDeployment();
