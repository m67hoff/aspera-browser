'use strict';

const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();

const nodeRequest = require('request');

const express = require('express');
const app = express();

const bodyParser = require('body-parser')
app.use(bodyParser.json());

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // accept untrusted certificates 
function json2s(obj) { return JSON.stringify(obj, null, 2); }  // format JSON payload for log

// start server on the specified port and binding host
app.listen(appEnv.port, appEnv.bind, function() {
  console.log('server starting on ' + appEnv.url);
});

// serve static files / angular web client 
app.use(express.static(__dirname + '/webclient'));

// enable CORS with preflight
const origin = 'http://localhost:4200';
app.options('*', (req, res) => {
  res.set({
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type, nodeURL'
  });
  res.sendStatus(200);
});

// listen on supported nodeAPI REST endpoints 
app.get('/info', makeNodeRequest);
app.post('/files/browse', makeNodeRequest);
app.post('/files/download_setup', makeNodeRequest);
app.post('/files/upload_setup', makeNodeRequest);
app.post('/files/delete', makeNodeRequest);
app.post('/files/create', makeNodeRequest);

function makeNodeRequest(localReq, localRes) {
  const options = {};
  options.url = localReq.headers.nodeurl + localReq.path;
  console.log('\n--> makeNodeRequest : ', options.url);
  options.method = localReq.method;
  options.json = localReq.body;
  options.headers = localReq.headers;
  // console.log('makeNodeRequest options:\n', json2s(options));

  nodeRequest(options, (error, remoteRes, remoteBody) => {
    localRes.set({
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': origin,
    });

    if (error) {
      console.log('remoteNodeRequest error:', error);
      switch (error.code) {
        case 'ECONNREFUSED':
          localRes.status(403)
          break;
        case 'ETIMEDOUT':
          localRes.status(504)
          break;
        case 'ENOTFOUND':
          localRes.status(404)
          break;
        default:
          localRes.status(500)
      }
      localRes.json(error);

    } else {
      console.log('remoteNodeRequest statusCode:', remoteRes.statusCode);
      // console.log('remoteNodeRequest body:', json2s(remoteBody));
      localRes.status(remoteRes.statusCode)
        .json(remoteBody);
    }
  });

} 