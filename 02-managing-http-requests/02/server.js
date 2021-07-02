const https = require('https');
const http = require('http');
const services = require('../../services');
const url = require('url');
const jsonBody = require("body/json");
const fs = require('fs');
const formidable = require('formidable');

/*
const server = https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
});
*/
const server = http.createServer();

server.on('request', (req, res) => {

  // simple error handler
  req.on('error', (err) =>{
    console.error('request error');
  });
  res.on('error', (err) =>{
    console.error('responce error');
  });

  // log incoming request
  console.log(req.method, req.url);

  // server logic
  const parsedUrl = url.parse(req.url, true);
  // get metadata
  if (req.method === 'GET' && parsedUrl.pathname === '/metadata'){
    const{ id } = parsedUrl.query;
    const metadata = services.fetchImageMetadata(id);
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    const serializedJSON = JSON.stringify(metadata);
    res.write(serializedJSON);
    res.end();
  }
  // post users
  else if (req.method === 'POST' && parsedUrl.pathname === '/users') {
    // do stuff if there is a body
    jsonBody(req,res, (err, body) =>{
      if (err) {
        console.log(err);
      } else {
        console.log(body);
        services.createUser(body['userName']);
      }
    });
  }
  else if (req.method === 'POST' && parsedUrl.pathname ==='/upload') { 
    const form = new formidable.IncomingForm({
      uploadDir: __dirname,
      keepExtensions: true,
      multiples: true,
      maxFileSize: 5 * 1024 * 1024,
      encoding: 'utf-8',
      maxFields: 20
    });

    form.parse(req)
    .on('fileBegin', (name, file) => {
      console.log('Our upload has started!');
    })
    .on('file', (name, file) => {
      console.log('Field + file pair has been received')
    })
    .on('field', (name, value) => {
      console.log ('Field received:');
      console.log(name, value);
    })
    .on('progress', (bytesReceived, bytesExpected) =>{
      console.log(bytesReceived + '/' + bytesExpected);
    })
    .on('error', (err) => {
      console.error(err);
      req.resume();
    })
    .on('aborted', () => {
      console.error('Request abordorted by user!');
    })
    .on('end', () => {
      console.log('Done - request fully received!');
      res.end('Success!');
    });

    /* 
    // simple way to do form parsing
    form.parse(req, (err, fields, files) => {
      console.log('\n fields:');
      console.log(fields);
      console.log('\n files:');
      console.log(files);
      if (err){
        console.log(err);
        res.statusCode = 500;
        res.end("Error!");
      }
      res.statusCode = 200;
      res.end("Success!");
    })
    */
  }
  else {
    fs.createReadStream("../../index.html").pipe(res);
  }
  /*
  // else return unknown
  else {
    res.writeHead(404, {
      'X-Powered-By':'Node'
      ,'Content-Type':'application/json'
    })
    res.end();
  }
  // simple response 
  res.end('This was served with http in node!');
  */
});

server.listen(8080);
