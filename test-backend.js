// Test script để kiểm tra backend
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8088,
  path: '/api/v1/healthcheck',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  res.on('data', (chunk) => {
    console.log(`Body: ${chunk}`);
  });
  
  res.on('end', () => {
    console.log('Backend is running!');
  });
});

req.on('error', (e) => {
  console.error(`Backend is not running: ${e.message}`);
});

req.end(); 