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
const staticOptions = {
  setHeaders: (res, path, stat) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
};
app.use(express.static(__dirname + '/webclient', staticOptions));

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
    if (error) {
      console.log('remoteNodeRequest error:', error);
      localRes.status(500)
        .json({ internal_error: 'Error requesting remote server: ' + error });
    } else {
      console.log('remoteNodeRequest statusCode:', remoteRes.statusCode);
      // console.log('remoteNodeRequest body:', json2s(remoteBody));
      localRes.status(remoteRes.statusCode)
        .json(remoteBody);
    }
  });

} 