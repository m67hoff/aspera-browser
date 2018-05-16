'use strict'

const fs = require('fs')
const path = require('path')
const log = require('npmlog')
const nodeRequest = require('request')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const packagejson = require('./package.json')
const helmet = require('helmet')

// set defaults
const LOGOUTPUT = process.stdout

const DEFAULT_WEBAPPCONFIG = path.join(__dirname, './webapp/webappconfig.json')
const WEBAPPCONFIG = './webappconfig.json'
const DEFAULT_SERVERCONFIG = path.join(__dirname, './serverconfig.json')
const SERVERCONFIG = './serverconfig.json'

// duplicate config file settings 
var LOGLEVEL = 'info'
var FIXED_NODEAPI_URL = ''
var FIXED_NODEAPI_USER = ''
var FIXED_NODEAPI_PASS = ''
var ENABLE_CORS = false
var CORS_ORIGIN = 'http://localhost:4200'
var PORT = 8080

// read in the config file and set log.level
function loadConf() {
  var c = JSON.parse(readConfig(SERVERCONFIG, DEFAULT_SERVERCONFIG))
  if (c.LOGLEVEL) { log.level = c.LOGLEVEL }
  log.notice('log  ', 'Read Config - Set LOGLEVEL to %j', c.LOGLEVEL)
  log.verbose('conf ', json2s(c))
  if (c.FIXED_NODEAPI_URL) { FIXED_NODEAPI_URL = c.FIXED_NODEAPI_URL }
  if (c.FIXED_NODEAPI_USER) { FIXED_NODEAPI_USER = c.FIXED_NODEAPI_USER }
  if (c.FIXED_NODEAPI_PASS) { FIXED_NODEAPI_PASS = c.FIXED_NODEAPI_PASS }
  if (c.ENABLE_CORS) { ENABLE_CORS = c.ENABLE_CORS }
  if (c.CORS_ORIGIN) { CORS_ORIGIN = c.CORS_ORIGIN }
  if (c.PORT) { PORT = c.PORT }
  return c
}

//**** Main  ****

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0' // accept untrusted certificates
log.stream = LOGOUTPUT
log.level = LOGLEVEL
log.notice('main', 'Moin Moin from asperabrowser v' + packagejson.version)

loadConf()

app.use(helmet())
app.use(bodyParser.json())

// start server on the specified port and binding host
if (process.env.VCAP_APP_PORT) { PORT = process.env.VCAP_APP_PORT }
app.listen(PORT, function() {
  log.http('express', 'server starting on ' + PORT)
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
app.get(getEndpoints, makeNodeRequest)
app.post(postEndpoints, makeNodeRequest)

// provide webapp configfile (default or custom)
var webappconfig = JSON.parse(readConfig(WEBAPPCONFIG, DEFAULT_WEBAPPCONFIG))
app.get(['/config','/webappconfig.json'], (req, res) => {
  log.http('express', 'Request ' + req.method + ' ' + req.originalUrl)
  log.verbose('express', 'webapp config:\n', json2s(webappconfig))
  res.send(webappconfig)
})

// serve static files / angular web client
log.http('express', 'static_file_path:', path.join(__dirname, '/webapp'))
app.use(express.static(path.join(__dirname, '/webapp')))

//**** end ****

// ***  functions
function makeNodeRequest(localReq, localRes) {
  const options = {}
  options.url = (localReq.headers.nodeurl) ? localReq.headers.nodeurl : 'https://demo.asperasoft.com:9092'
  if (FIXED_NODEAPI_URL !== '') {
    log.verbose('makeNodeRequest', 'set URL from config: %s', FIXED_NODEAPI_URL)
    options.url = FIXED_NODEAPI_URL
  }
  options.url += localReq.path
  log.http('makeNodeRequest', options.url)
  options.method = localReq.method
  options.json = localReq.body
  options.headers = localReq.headers
  if (FIXED_NODEAPI_USER !== '') {
    log.verbose('makeNodeRequest', 'set authorization from config -> User: %s Password: %s', FIXED_NODEAPI_USER, FIXED_NODEAPI_PASS)
    options.headers.authorization = 'Basic ' + btoa(FIXED_NODEAPI_USER + ':' + FIXED_NODEAPI_PASS)
  }
  log.verbose('makeNodeRequest', 'options:\n', json2s(options))

  nodeRequest(options, (error, remoteRes, remoteBody) => {
    if (ENABLE_CORS) {
      localRes.set({
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': CORS_ORIGIN
      })
    }
    if (error) {
      log.error('remoteNodeRequest', 'error:', error)
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
      log.http('remoteNodeRequest', 'statusCode:', remoteRes.statusCode)
      log.verbose('remoteNodeRequest', 'body:\n', json2s(remoteBody))
      localRes.status(remoteRes.statusCode)
        .json(remoteBody)
    }
  })
}

function json2s(obj) { return JSON.stringify(obj, null, 2) }  // format JSON payload for log
function btoa(str) { return Buffer.from(str).toString('base64') } // like Browser btoa
function atob(b64) { return Buffer.from(b64, 'base64').toString() } // like Browser atob

// read custom configf file  if not there ready default config file 
function readConfig(cust, def) {
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
    log.error('config', '--> no config !!! return empty json !!!!')
    return '{}'
  }
}
