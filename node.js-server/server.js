'use strict';

const fs = require('fs')
const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();
const log = require('npmlog');
const nodeRequest = require('request');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')

// set environment
const CONFIG = './serverconfig.json'
const LOGOUTPUT = process.stdout

function json2s(obj) { return JSON.stringify(obj, null, 2); }  // format JSON payload for log

// read in the config file and set log.level
function setConf () {
  var c = JSON.parse(fs.readFileSync(CONFIG))
  log.level = c.LOGLEVEL
  log.warn('log  ', 'Read Config & update \nSet LOGLEVEL to %j', c.LOGLEVEL)
  log.verbose('conf ', json2s(c))
  return c
}


process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // accept untrusted certificates
log.stream = LOGOUTPUT;
var config = setConf()

app.use(bodyParser.json());

// start server on the specified port and binding host
app.listen(appEnv.port, appEnv.bind, function() {
  log.info('express', 'server starting on ' + appEnv.url);
});

// serve static files / angular web client
app.use(express.static(__dirname + '/webclient'));

// enable CORS with preflight
const origin = 'http://localhost:4200';
app.options('*', (req, res) => {
  log.verbose('express', 'preflight request from: ' + req.headers.origin);
  res.set({
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type, nodeURL'
  });
  res.sendStatus(200);
  log.verbose('express', 'preflight response:\n', json2s(res._headers));
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
  log.info('makeNodeRequest', options.url);
  options.method = localReq.method;
  options.json = localReq.body;
  options.headers = localReq.headers;
  log.verbose('makeNodeRequest', 'options:\n', json2s(options));

  nodeRequest(options, (error, remoteRes, remoteBody) => {
    localRes.set({
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': origin
    });

    if (error) {
      log.error('remoteNodeRequest', 'error:', error);
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
      log.info('remoteNodeRequest', 'statusCode:', remoteRes.statusCode);
      log.verbose('remoteNodeRequest', 'body:\n', json2s(remoteBody));
      localRes.status(remoteRes.statusCode)
        .json(remoteBody);
    }
  });
}
