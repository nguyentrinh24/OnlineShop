// Test script để kiểm tra các API endpoints
const http = require('http');

const testEndpoints = [
  '/api/v1/healthcheck',
  '/api/v1/categories',
  '/api/v1/products',
  '/api/v1/products/featured',
  '/api/v1/orders/latest'
];

function testEndpoint(path) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 8088,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          path: path,
          status: res.statusCode,
          success: res.statusCode === 200,
          data: data.substring(0, 100) + (data.length > 100 ? '...' : '')
        });
      });
    });

    req.on('error', (e) => {
      resolve({
        path: path,
        status: 'ERROR',
        success: false,
        error: e.message
      });
    });

    req.end();
  });
}

async function runTests() {
  console.log('=== Testing API Endpoints ===\n');
  
  for (const endpoint of testEndpoints) {
    const result = await testEndpoint(endpoint);
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${endpoint}: ${result.status}`);
    if (!result.success && result.error) {
      console.log(`   Error: ${result.error}`);
    }
  }
  
  console.log('\n=== Test Complete ===');
}

runTests(); 