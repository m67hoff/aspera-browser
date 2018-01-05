'use strict';

const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();

const nodeRequest = require('request');

const express = require('express');
const app = express();

const bodyParser = require('body-parser')
app.use(bodyParser.json());

// Globals
function json2s(obj) { return JSON.stringify(obj, null, 2); } // format JSON payload for log
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// start server on the specified port and binding host
app.listen(appEnv.port, appEnv.bind, function() {
  console.log('server starting on ' + appEnv.url);
});

// serve static files out of ./public
const staticOptions = {
  setHeaders: (res, path, stat) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
};
app.use(express.static(__dirname + '/webclient', staticOptions));
// console.log(__dirname + '/webclient');

app.get('/info', (req, res) => {
  console.log('\n--> get info');
  // console.log('info headers: ', json2s(req.headers));

  makeNodeRequest(req, res, 'GET', '/info')
});

app.post('/files/:call', (req, res) => {
  var call = req.params.call;
  console.log('\n--> post files - call: ', call);
  // console.log('files headers: ', json2s(req.headers));
  console.log('post files body: ', json2s(req.body));

  makeNodeRequest(req, res, 'POST', '/files/' + call)
});

function makeNodeRequest(localReq, localRes, method, nodeService) {

  const options = {};
  options.url = localReq.headers.nodeurl + nodeService;
  options.method = method;
  options.json = localReq.body;
  options.headers = localReq.headers;
  //options.url = 'https://demo.asperasoft.com:9092/info';
  //options.auth = { 'user': 'asperaweb', 'pass': 'demoaspera' };
  console.log('makeNodeRequest options:\n', json2s(options));

  nodeRequest(options, (error, remoteRes, body) => {
    if (error) {
      console.log('remoteNodeRequest error:', error);
      localRes.status(500)
        .json({ internal_error: 'Error requesting remote server: ' + error });
    } else {
      console.log('remoteNodeRequest statusCode:', remoteRes && remoteRes.statusCode);
      // console.log('remoteNodeRequest body:', json2s(body));
      localRes.status(remoteRes.statusCode)
        .json(body);
    }
  });

} 