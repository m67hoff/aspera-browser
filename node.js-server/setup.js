const log = require('npmlog')
const fs = require('fs')
const path = require('path')
const child_process = require('child_process')

const C = require('./const')

const platform = process.env.PLATFORM ? process.env.PLATFORM : process.platform

exports.service = function () {
  switch (platform) {
    case 'linux':
      log.info('setup', 'Setup running for platform: ' + platform)

      try {
        if (!fs.existsSync(C.CONFIG_DIR)) {
          log.info('setup', 'create config directory: ' + C.CONFIG_DIR)
          fs.mkdirSync(C.CONFIG_DIR)
        }

        if (!fs.lstatSync(C.SERVICE_DIR).isDirectory()) {
          log.error('setup', 'Error: dir not found: ' + C.SERVICE_DIR)
          log.error('setup', 'Error: at the moment we only support linux with systemd')
          process.exit(C.ERR_LINUX_FS)
        }
        // copy service
        log.info('setup', 'copy service setup ' + path.join(__dirname, C.SERVICE) + ' -> ' + path.join(C.SERVICE_DIR, C.SERVICE))
        fs.copyFileSync(path.join(__dirname, C.SERVICE), path.join(C.SERVICE_DIR, C.SERVICE))

        // reload systemd
        log.info('setup', 'reload systemd')
        child_process.execSync('systemctl daemon-reload', { 'timeout': 2000 })

        // enable service
        log.info('setup', 'enable asperabrowser service')
        child_process.execSync('systemctl enable ' + C.SERVICE, { 'timeout': 2000 })

        // restart service
        log.info('setup', 'restarting asperabrowser service')
        child_process.execSync('systemctl restart ' + C.SERVICE, { 'timeout': 2000 })

        // status service
        child_process.execSync('sleep 1')
        exports.status()
      } catch (e) {
        log.error('setup', e.message)
        log.error('setup', 'Error: at the moment only linux with systemd is supported.')
        process.exit(C.ERR_LINUX_TRY)
      }
      break

    default:
      log.error('setup', 'at the moment only linux is supported.  Your platform: ' + platform)
      process.exit(C.ERR_OS)
  }
}

exports.status = function () {
  switch (platform) {
    case 'linux':
      try {
        // status service
        log.info('status', 'service status (systemctl status asperabrowser):')
        var stdout = child_process.execSync('systemctl status ' + C.SERVICE, { 'timeout': 2000 })
        log.info('status', '\n' + stdout)
      } catch (e) {
        log.error('status', e.message)
        process.exit(C.ERR_LINUX_TRY)
      }
      break

    default:
      log.error('status', 'at the moment only linux is supported.  Your platform: ' + platform)
      process.exit(C.ERR_OS)
  }
}

exports.restart = function () {
  switch (platform) {
    case 'linux':
      try {
        // restart service
        log.info('restart', 'service restart (systemctl restart asperabrowser):')
        child_process.execSync('systemctl restart ' + C.SERVICE, { 'timeout': 2000 })

        // status service
        child_process.execSync('sleep 1')
        exports.status()
      } catch (e) {
        log.error('status', e.message)
        process.exit(C.ERR_LINUX_TRY)
      }
      break

    default:
      log.error('status', 'at the moment only linux is supported.  Your platform: ' + platform)
      process.exit(C.ERR_OS)
  }
}

exports.copyDefaults = function () {
  switch (platform) {
    case 'linux':
    case 'docker':
      try {
        if (!fs.existsSync(C.CONFIG_DIR)) {
          log.info('setup', 'create config directory: ' + C.CONFIG_DIR)
          fs.mkdirSync(C.CONFIG_DIR)
        }

        copyDefaultsFile(C.DEFAULT_WEBAPPCONFIG, C.WEBAPPCONFIG)
        copyDefaultsFile(C.DEFAULT_SERVERCONFIG, C.SERVERCONFIG)
        copyDefaultsFile(C.DEFAULT_HTTPS_KEY, C.HTTPS_KEY)
        copyDefaultsFile(C.DEFAULT_HTTPS_CERT, C.HTTPS_CERT)
      } catch (e) {
        log.error('setup', e.message)
        process.exit(C.ERR_LINUX_TRY)
      }
      break

    default:
      log.error('setup', 'at the moment only linux and docker is supported.  Your platform: ' + platform)
      process.exit(C.ERR_OS)
  }
}

function copyDefaultsFile (source, target) {
  target = path.join(C.CONFIG_DIR, target)

  log.info('setup', 'copy config file ' + source + ' -> ' + target)
  fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
}
