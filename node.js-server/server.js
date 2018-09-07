#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')
const https = require('https')

const log = require('npmlog')
const program = require('commander')

const packagejson = require('./package.json')
const C = require('./const')
const setup = require('./setup')

const nodeApiRequest = require('request')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const helmet = require('helmet')

// duplicate config file settings
var LOGLEVEL = 'info'
var FIXED_NODEAPI_URL = ''
var FIXED_NODEAPI_USER = ''
var FIXED_NODEAPI_PASS = ''
var ENABLE_CORS = false
var CORS_ORIGIN = 'http://localhost:4200'
var PORT = 8888

var HTTPS_PORT = 44344
var USE_HTTPS = false

/**************************************************************/
/*                      Main                                  */
/**************************************************************/
log.stream = C.LOGOUTPUT
log.level = LOGLEVEL

// cli options
program
  .option('--config', 'configure and start the service. Enable auto restart (linux)')
  .option('--defaults', 'copy default config files')
  .option('-s, --status', 'show service status (linux)')
  .option('-r, --restart', 'restart service (linux)')
  .version(packagejson.version, '-v, --version')
  .parse(process.argv)

if (program.config) {
  loadConf()
  setup.service()
  process.exit(0)
}

if (program.status) {
  loadConf()
  setup.status()
  process.exit(0)
}

if (program.restart) {
  loadConf()
  setup.restart()
  process.exit(0)
}

if (program.defaults) {
  loadConf()
  setup.copyDefaults()
  process.exit(0)
}

// start asperabrowser
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0' // accept untrusted certificates
log.notice('main', 'Moin Moin from asperabrowser v' + packagejson.version)

loadConf()
// PORT from Cloud Foundry Environment (if running under CF)  https://docs.cloudfoundry.org/devguide/deploy-apps/environment-variable.html
if (process.env.VCAP_APP_PORT) {
  PORT = process.env.VCAP_APP_PORT
  log.info('main', 'set port from CF environment ' + PORT)
}
if (process.env.PORT) {
  PORT = process.env.PORT
  log.info('main', 'set port from CF environment ' + PORT)
}

// service reload request
process.on('SIGHUP', () => {
  log.warn('main', 'Received SIGHUP -> reload config files')
  loadConf()
  webappconfig = JSON.parse(readConfig(C.WEBAPPCONFIG, C.DEFAULT_WEBAPPCONFIG))
})

app.use(helmet())
app.use(bodyParser.json())

if (
  (PORT <= 1024 || (USE_HTTPS && HTTPS_PORT <= 1024)) &&
  !isAdmin()
) {
  log.error('main', 'Error: only root can run with ports below 1024')
  log.error('main', 'PORT: ' + PORT + ' HTTPS_PORT: ' + HTTPS_PORT)
  process.exit(C.ERR_ROOT)
}

// start https server
if (USE_HTTPS) {
  const httpsOptions = {
    key: readConfig(C.HTTPS_KEY, C.DEFAULT_HTTPS_KEY),
    cert: readConfig(C.HTTPS_CERT, C.DEFAULT_HTTPS_CERT)
  }

  var httpsApp = https.createServer(httpsOptions, app)

  httpsApp.listen(HTTPS_PORT, function () {
    log.http('https', 'https server starting on ' + HTTPS_PORT)
  })

  app.use(function (req, res, next) {
    if (req.secure) {
      next()
    } else {
      var httpsUrl = 'https://' + req.hostname + ':' + HTTPS_PORT + req.url
      log.http('https', 'redirect to: ' + httpsUrl)
      res.redirect(httpsUrl)
    }
  })
}

// start http server
app.listen(PORT, function () {
  log.http('express', 'server starting on ' + PORT)
  dropRoot()
})

// enable CORS with preflight
if (ENABLE_CORS) {
  log.http('cors', 'set CORS origin to ' + CORS_ORIGIN)
  app.options('*', (req, res) => {
    log.http('express', 'preflight request from: ' + req.headers.origin)
    res.set({
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': CORS_ORIGIN,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type, nodeURL'
    })
    res.sendStatus(200)
    log.verbose('express', 'preflight response:\n', json2s(res._headers))
  })
}

// listen on supported nodeAPI REST endpoints
var getEndpoints = ['/info']
var postEndpoints = [
  '/files/browse',
  '/files/download_setup',
  '/files/upload_setup',
  '/files/delete',
  '/files/create'
]
app.get(getEndpoints, createNodeRequest)
app.post(postEndpoints, createNodeRequest)

// provide webapp configfile (default or custom)
var webappconfig = JSON.parse(readConfig(C.WEBAPPCONFIG, C.DEFAULT_WEBAPPCONFIG))
app.get(['/config', '/webappconfig.json'], (req, res) => {
  log.http('express', 'Request ' + req.method + ' ' + req.originalUrl)
  log.verbose('express', 'webapp config:\n', json2s(webappconfig))
  res.send(webappconfig)
})

// serve static files / angular web client
log.http('express', 'static_file_path: ', path.join(__dirname, '/webapp'))
app.use(function (req, res, next) {
  log.http('express', 'Static ' + req.method + ' ' + req.originalUrl)
  next()
})
app.use(express.static(path.join(__dirname, '/webapp')))

/**************************************************************/
/*                      Functions                             */
/**************************************************************/

function createNodeRequest (localReq, localRes) {
  const options = {}
  options.url = (localReq.headers.nodeurl) ? localReq.headers.nodeurl : 'https://demo.asperasoft.com:9092'
  if (FIXED_NODEAPI_URL !== '') {
    log.verbose('createNodeRequest', 'set URL from config: %s', FIXED_NODEAPI_URL)
    options.url = FIXED_NODEAPI_URL
  }
  options.url += localReq.path
  log.http('createNodeRequest', options.url)
  options.method = localReq.method
  options.json = localReq.body
  options.headers = localReq.headers
  if (FIXED_NODEAPI_USER !== '') {
    log.verbose('createNodeRequest', 'set authorization from config -> User: %s Password: %s', FIXED_NODEAPI_USER, FIXED_NODEAPI_PASS)
    options.headers.authorization = 'Basic ' + btoa(FIXED_NODEAPI_USER + ':' + FIXED_NODEAPI_PASS)
  }
  log.verbose('createNodeRequest', 'options:\n', json2s(options))

  nodeApiRequest(options, (error, remoteRes, remoteBody) => {
    if (ENABLE_CORS) {
      localRes.set({
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': CORS_ORIGIN
      })
    }
    if (error) {
      log.error('remoteNodeApiRequest', 'error:', error)
      switch (error.code) {
        case 'ECONNREFUSED':
          localRes.status(403)
          break
        case 'ETIMEDOUT':
          localRes.status(504)
          break
        case 'ENOTFOUND':
          localRes.status(404)
          break
        default:
          localRes.status(500)
      }
      localRes.json(error)
    } else {
      log.http('remoteNodeApiRequest', 'statusCode:', remoteRes.statusCode)
      log.verbose('remoteNodeApiRequest', 'body:\n', json2s(remoteBody))
      localRes.status(remoteRes.statusCode)
        .json(remoteBody)
    }
  })
}

function json2s (obj) { return JSON.stringify(obj, null, 2) } // format JSON payload for log
function btoa (str) { return Buffer.from(str).toString('base64') } // like Browser btoa
function atob (b64) { return Buffer.from(b64, 'base64').toString() } // like Browser atob

// read custom config file  if not there, than read default config file
function readConfig (cust, def) {
  try {
    var f = fs.readFileSync(cust)
    return f
  } catch (e) {
    log.warn('config', 'Read custom config failed : %j', cust)
  }
  log.warn('config', 'Try default config: %j', def)
  try {
    f = fs.readFileSync(def)
    return f
  } catch (e) {
    log.error('config', 'Read default config failed : %j', def)
    log.error('config', '--> exit')
    process.exit(C.ERR_CONFIG)
  }
}

// read in the config file and set log.level
function loadConf () {
  var c = JSON.parse(readConfig(C.SERVERCONFIG, C.DEFAULT_SERVERCONFIG))
  if (c.LOGLEVEL) { log.level = c.LOGLEVEL }
  log.notice('log  ', 'Read Config - Set LOGLEVEL to %j', c.LOGLEVEL)
  log.verbose('conf ', json2s(c))
  if (c.FIXED_NODEAPI_URL) { FIXED_NODEAPI_URL = c.FIXED_NODEAPI_URL }
  if (c.FIXED_NODEAPI_USER) { FIXED_NODEAPI_USER = c.FIXED_NODEAPI_USER }
  if (c.FIXED_NODEAPI_PASS) { FIXED_NODEAPI_PASS = c.FIXED_NODEAPI_PASS }
  if (c.ENABLE_CORS) { ENABLE_CORS = c.ENABLE_CORS }
  if (c.CORS_ORIGIN) { CORS_ORIGIN = c.CORS_ORIGIN }
  if (c.PORT) { PORT = c.PORT }
  if (c.HTTPS_PORT) { HTTPS_PORT = c.HTTPS_PORT }
  if (c.USE_HTTPS) { USE_HTTPS = c.USE_HTTPS }
  return c
}

// portable version for process.getuid() == 0
function isAdmin () {
  switch (process.platform) {
    case 'darwin':
    case 'linux':
      if (process.getuid() === 0) return true
      break
    case 'win32':
      log.warn('main', 'currently checking for admin rights is not supported on Microsoft Windows')
      break
    default:
      log.error('main', 'unsupported OS. your platform: ' + process.platform)
      break
  }
  return false
}

// set the user to nobody if running as root
function dropRoot () {
  switch (process.platform) {
    case 'darwin':
    case 'linux':
      if (process.getuid() === 0) {
        log.notice('main', 'drop root - new user id:', process.getuid() + ', Group ID:', process.getgid())
        process.setgid('nobody')
        process.setuid('nobody')
      }
      break
    case 'win32':
      log.warn('main', 'currently dropping process rights is not supported on Microsoft Windows')
      log.warn('main', 'still running under same user')
      break
    default:
      log.error('main', 'unsupported OS. your platform: ' + process.platform)
      log.warn('main', 'dropping process rights not supported')
      log.warn('main', 'still running under same user')
      break
  }
}
