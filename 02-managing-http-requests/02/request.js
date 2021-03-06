const http = require('http');
const https = require('https');

const data = JSON.stringify({
  userName:'gehouser'
});

const options = {
  hostname: 'localhost',
  port: 8080, // 443,
  path: '/users',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
    // 'Authorization': Buffer.from('myUsername' + ':' + 'myPassword').toString('base64')
  }
};

//const request = https.request(
const request = http.request(
  options,
  (response) => {
    console.log(`statusCode: ${response.statusCode}`);
    console.log(response.headers);

    response.on('data', (chunk) => {
      console.log('This is a chunk: \n');
      console.log(chunk.toString());
    });
  }
);

request.on('error', (err) => {
  console.error(err);
});

request.write(data);

request.end();
