const log = require('npmlog')
const fs = require('fs')
const path = require('path')
const child_process = require('child_process')

const ERR_OS = 1
const ERR_LINUX_TRY = 2
const ERR_LINUX_FS = 3

const SERVICE = 'asperabrowser.service'
const SERVICE_CONFIG = path.join(__dirname, SERVICE)
const SERVICE_DIR = '/usr/lib/systemd/system'

exports.service = function() {
    switch (process.platform) {
        case "linux":
            log.info('setup', 'Setup running for platform: ' + process.platform)

            try {
                if (!fs.lstatSync(SERVICE_DIR).isDirectory()) {
                    log.error('setup', 'Error: dir not found: ' + SERVICE_DIR)
                    log.error('setup', 'Error: at the moment we only support linux with systemd')
                    process.exit(ERR_LINUX_FS)
                }
                // copy service   
                log.info('setup', 'copy service setup ' + path.join(__dirname, SERVICE) + ' to ' + path.join(SERVICE_DIR, SERVICE))
                fs.copyFileSync(path.join(__dirname, SERVICE), path.join(SERVICE_DIR, SERVICE));

                // reload service
                log.info('setup', 'reload systemd')
                child_process.execSync('systemctl daemon-reload', { "timeout": 2000 })

                // restart service               
                log.info('setup', 'restarting asperabrowser service')
                child_process.execSync('systemctl restart asperabrowser', { "timeout": 2000 })

                // status service             
                log.info('setup', 'service status (systemctl status asperabrowser):')
                child_process.execSync('sleep 1')
                var stdout = child_process.execSync('systemctl status asperabrowser', { "timeout": 2000 })
                log.info('setup', '\n' + stdout)

            } catch (e) {
                log.error('setup', e.message)
                log.error('setup', 'Error: at the moment only linux with systemd is supported.')
                process.exit(ERR_LINUX_TRY)
            }
            break;

        default:
            log.error('setup', 'at the moment only linux is supported.  Your platform: ' + process.platform)
            process.exit(ERR_OS)
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
                log.error('status', 'Error: at the moment only linux with systemd is supported.')
                process.exit(ERR_LINUX_TRY)
            }
            break;

        default:
            log.error('status', 'at the moment only linux is supported.  Your platform: ' + process.platform)
            process.exit(ERR_OS)
    }
}