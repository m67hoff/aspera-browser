const log = require('npmlog')
const fs = require('fs')
const path = require('path')
const child_process = require('child_process')

const C = require('./const')

exports.service = function() {
    switch (process.platform) {
        case "linux":
            log.info('setup', 'Setup running for platform: ' + process.platform)

            try {

                if (!fs.existsSync(C.WORKING_DIR)) {
                    log.info('setup', 'create working directory: ' + C.WORKING_DIR)
                    fs.mkdirSync(C.WORKING_DIR)
                }

                if (!fs.lstatSync(C.SERVICE_DIR).isDirectory()) {
                    log.error('setup', 'Error: dir not found: ' + C.SERVICE_DIR)
                    log.error('setup', 'Error: at the moment we only support linux with systemd')
                    process.exit(C.ERR_LINUX_FS)
                }
                // copy service   
                log.info('setup', 'copy service setup ' + path.join(__dirname, C.SERVICE) + ' -> ' + path.join(C.SERVICE_DIR, C.SERVICE))
                fs.copyFileSync(path.join(__dirname, C.SERVICE), path.join(C.SERVICE_DIR, C.SERVICE));

                // reload service
                log.info('setup', 'reload systemd')
                child_process.execSync('systemctl daemon-reload', { "timeout": 2000 })

                // restart service               
                log.info('setup', 'restarting asperabrowser service')
                child_process.execSync('systemctl restart asperabrowser', { "timeout": 2000 })

                // status service             
                child_process.execSync('sleep 1')
                exports.status()

            } catch (e) {
                log.error('setup', e.message)
                log.error('setup', 'Error: at the moment only linux with systemd is supported.')
                process.exit(C.ERR_LINUX_TRY)
            }
            break;

        default:
            log.error('setup', 'at the moment only linux is supported.  Your platform: ' + process.platform)
            process.exit(C.ERR_OS)
    }
}

exports.status = function() {
    switch (process.platform) {
        case "linux":
            try {
                // status service             
                log.info('status', 'service status (systemctl status asperabrowser):')
                var stdout = child_process.execSync('systemctl status asperabrowser', { "timeout": 2000 })
                log.info('status', '\n' + stdout)

            } catch (e) {
                log.error('status', e.message)
                process.exit(C.ERR_LINUX_TRY)
            }
            break;

        default:
            log.error('status', 'at the moment only linux is supported.  Your platform: ' + process.platform)
            process.exit(C.ERR_OS)
    }
}

exports.restart = function() {
    switch (process.platform) {
        case "linux":
            try {
                // restart service             
                log.info('restart', 'service restart (systemctl restart asperabrowser):')
                child_process.execSync('systemctl restart asperabrowser', { "timeout": 2000 })
                
                // status service             
                child_process.execSync('sleep 1')
                exports.status()

            } catch (e) {
                log.error('status', e.message)
                process.exit(C.ERR_LINUX_TRY)
            }
            break;

        default:
            log.error('status', 'at the moment only linux is supported.  Your platform: ' + process.platform)
            process.exit(C.ERR_OS)
    }
}

exports.copyDefaults = function() {
    switch (process.platform) {
        case "linux":
            try {

                if (!fs.existsSync(C.WORKING_DIR)) {
                    log.info('setup', 'create working directory: ' + C.WORKING_DIR)
                    fs.mkdirSync(C.WORKING_DIR)
                } 
                
                copyDefaultsFile( C.DEFAULT_WEBAPPCONFIG, C.WEBAPPCONFIG)
                copyDefaultsFile( C.DEFAULT_SERVERCONFIG, C.SERVERCONFIG)
                copyDefaultsFile( C.DEFAULT_HTTPS_KEY, C.HTTPS_KEY)
                copyDefaultsFile( C.DEFAULT_HTTPS_CERT, C.HTTPS_CERT)
                
            } catch (e) {
                log.error('setup', e.message)
                process.exit(C.ERR_LINUX_TRY)
            }
            break;

        default:
            log.error('setup', 'at the moment only linux is supported.  Your platform: ' + process.platform)
            process.exit(C.ERR_OS)
    }
}

function copyDefaultsFile(source, target) {

    target = path.join(C.WORKING_DIR, target)

    log.info('setup', 'copy config file ' + source + ' -> ' + target)
    fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
}