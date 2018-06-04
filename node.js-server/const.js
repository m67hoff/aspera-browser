const fs = require('fs')
const path = require('path')

exports.LOGOUTPUT = process.stdout

// config files 
exports.DEFAULT_WEBAPPCONFIG = path.join(__dirname, 'webapp/webappconfig.json')
exports.DEFAULT_SERVERCONFIG = path.join(__dirname, 'serverconfig.json')
exports.WEBAPPCONFIG = './webappconfig.json'
exports.SERVERCONFIG = './serverconfig.json'

exports.DEFAULT_HTTPS_KEY = path.join(__dirname, 'ssl.key')
exports.DEFAULT_HTTPS_CERT = path.join(__dirname, 'ssl.cert')
exports.HTTPS_KEY = './ssl.key'
exports.HTTPS_CERT = './ssl.cert'

// systemd / setup constants
exports.WORKING_DIR = '/opt/asperabrowser'
exports.SERVICE = 'asperabrowser.service'
exports.SERVICE_DIR = '/usr/lib/systemd/system'

// error codes
exports.ERR_OS = 1
exports.ERR_LINUX_TRY = 2
exports.ERR_LINUX_FS = 3
exports.ERR_ROOT = 4
exports.ERR_CONFIG = 5


