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

function json2s(obj) { return JSON.stringify(obj, null, 2) }  // format JSON payload for log
function btoa(str) { return new Buffer(str).toString('base64') } // like Browser btoa
function atob(b64) { return new Buffer.from(b64, 'base64').toString() } // like Browser atob


// read in the config file and set log.level
function setConf() {
  var c = JSON.parse(fs.readFileSync(CONFIG))
  log.level = c.LOGLEVEL
  log.warn('log  ', 'Read Config - Set LOGLEVEL to %j', c.LOGLEVEL)
  log.verbose('conf ', json2s(c))
  return c
}


process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // accept untrusted certificates
log.stream = LOGOUTPUT;
var config = setConf()

app.use(bodyParser.json());

// start server on the specified port and binding host
app.listen(appEnv.port, appEnv.bind, function() {
  log.http('express', 'server starting on ' + appEnv.url);
});

// serve static files / angular web client
app.use(express.static(__dirname + '/webclient'));

// enable CORS with preflight
if (config.ENABLE_CORS) {
  log.http('cors', 'set CORS origin to ' + config.CORS_ORIGIN);
  app.options('*', (req, res) => {
    log.http('express', 'preflight request from: ' + req.headers.origin);
    res.set({
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': config.CORS_ORIGIN,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type, nodeURL'
    });
    res.sendStatus(200);
    log.verbose('express', 'preflight response:\n', json2s(res._headers));
  });
}

// listen on supported nodeAPI REST endpoints
app.get('/info', makeNodeRequest);
app.post('/files/browse', makeNodeRequest);
app.post('/files/download_setup', makeNodeRequest);
app.post('/files/upload_setup', makeNodeRequest);
app.post('/files/delete', makeNodeRequest);
app.post('/files/create', makeNodeRequest);

function makeNodeRequest(localReq, localRes) {
  const options = {};
  options.url = (config.FIX_NODEAPI_URL !== '') ? config.FIX_NODEAPI_URL : localReq.headers.nodeurl;
  options.url += localReq.path;
  log.http('makeNodeRequest', options.url);
  options.method = localReq.method;
  options.json = localReq.body;
  options.headers = localReq.headers;
  if (config.FIX_NODEAPI_USER !== '') {
    log.verbose('makeNodeRequest', 'set authorization from config -> User: %s Password: %s', config.FIX_NODEAPI_USER, config.FIX_NODEAPI_PASS)
    options.headers.authorization = 'Basic ' + btoa(config.FIX_NODEAPI_USER + ':' + config.FIX_NODEAPI_PASS)
  }
  log.verbose('makeNodeRequest', 'options:\n', json2s(options));

  nodeRequest(options, (error, remoteRes, remoteBody) => {
    if (config.ENABLE_CORS) {
      localRes.set({
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': config.CORS_ORIGIN
      });
    }
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
      log.http('remoteNodeRequest', 'statusCode:', remoteRes.statusCode);
      log.verbose('remoteNodeRequest', 'body:\n', json2s(remoteBody));
      localRes.status(remoteRes.statusCode)
        .json(remoteBody);
    }
  });
}
