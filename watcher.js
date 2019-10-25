/**
 * 开发环境中兼听应用文件修改并自动重启应用
 */
const childProcess = require('child_process')
const chokidar = require('chokidar')


const watcher = chokidar.watch([
  'dist/config',
  'dist/lib',
  'dist/controller',
  'dist/service',
  'dist/app.js'
], {
  ignored: /node_modules/
})
let tick = null
let child = null

// 是否为调试模式，添加调试商品
let debugPort = process.env.NODE_DEBUG_PORT
let args = ['dist/app.js']
if (debugPort) {
  args.unshift(`--inspect-brk=${debugPort}`)
}

/**
 * 启用应用
 * @param {*} callback 
 */
const startApp = (callback) => {
  if (child) {
    child.on('close', () => {
      console.log('\033[36m==   App\'s old process is closed!')
      child = null
      startApp(callback)
    })
    child.kill()
    return
  }
  child = childProcess.spawn('node', args, {
    env: {
      NODE_ENV: 'development'
    }
  })
  console.log('\033[36m==   App\' new process.pid: ', child.pid)
  console.log('\033[36m===================================')
  
  child.stdout.on('data', data => {
    process.stdout.write('\033[37m[log] ' + new Date().toLocaleTimeString() + ' [info]:  \033[32m' + data + '\033[0m')
  })
  child.stderr.on('data', data => {
    process.stderr.write('\033[37m[log] ' + new Date().toLocaleTimeString() + ' [error]: \033[31m' + data + '\033[0m')
  })
  child.on('close', () => {
    child = null
  })
  typeof callback == 'function' && callback()
}

/**
 * 兼听文件变化
 */

watcher.on('ready', () => {
  if(watcher._isReady === true) return
  watcher._isReady = true
  console.log('\033[36m===================================')
  console.log('\033[36m==   App is starting...')
  startApp()
  // 做一个延时，防止未完全ready就重启
  setTimeout(() => {
    watcher.on('all', (type, path) => {
      if (tick) return
      tick = setTimeout(() => {
        console.log('\033[36m===================================')
        console.log('\033[36m==   App is restarting...')
        startApp(() => {
          clearTimeout(tick)
          tick = null
        })
      }, 1000)
    })
  }, 1000)

})