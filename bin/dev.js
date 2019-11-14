/**
 * 开发环境中兼听应用文件修改并自动重启应用
 */
const childProcess = require('child_process')
const chokidar = require('chokidar')
const chalk = require('chalk').default

/**
 * 配置项
 */
const config = {
  // 兼听的目录
  watch: ['dist/'],
  // 忽略
  ignored: /node_modules/
}



/**
 * 统一日志打印
 */
const logger = {
  info(data, from = 'app') {
    process.stdout.write(chalk.gray('[' + from + '] ' + new Date().toLocaleTimeString() + ' [info]:  ') + chalk.green(data))
  },
  err(data, from = 'app') {
    process.stdout.write(chalk.gray('[' + from + '] ' + new Date().toLocaleTimeString() + ' [info]:  ') + chalk.red(data))
  },
  print(data, color = 'blue') {
    process.stdout.write(chalk[color](data) + '\n')
  }
}
/**
 * 一个延时的promise
 * @param {duration} 秒数
 */
const deleyTime = (duration = 300) => {
  return new Promise(resolve => {
    setTimeout(resolve, duration)
  })
}


/**
 * 子进程启动tsc兼听
 */
const satarTsc = () => {
  let count = 0
  return new Promise((resolve, reject) => {
    const tsc = childProcess.exec(process.cwd() + '/node_modules/.bin/tsc -w')
    tsc.stdout.on('data', data => {
      logger.info(data, 'tsc')
      count++
      if (count === 3) {
        resolve(true)
      }
    })
    tsc.stderr.on('data', data => {
      logger.err(data, 'tsc')
      reject(data)
    })
    tsc.on('error', data => {
      logger.err(data, 'tsc')
      reject(data)
    })
  })
}

/**
 * 子进程启用应用
 * @param {*} callback 
 */
let child = null // 应用子进程
const startApp = (callback) => {
  // 是否为调试模式，添加调试端口
  const debugPort = process.env.NODE_DEBUG_PORT
  // 调试时添加端口参数
  let args = ['dist/app.js']
  if (debugPort) args.unshift(`--inspect-brk=${debugPort}`)

  if (child) {
    child.on('close', () => {
      logger.print('==   App\'s old process is closed!')
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
  logger.print('==   App\'s new process.pid: ' + child.pid)
  logger.print('===================================')

  child.stdout.on('data', data => logger.info(data))
  child.stderr.on('data', data => logger.err(data))
  child.on('close', () => {
    child = null
  })
  typeof callback == 'function' && callback()
}

/**
 * 主进程启动文件兼听
 */
const startWatcher = () => {
  // 延时重启计时器
  let tick = null

  // 兼听dist目录
  const watcher = chokidar.watch(config.watch, {
    ignored: config.ignored
  })
  // 兼听是否已就绪
  let isReady = false
  watcher.on('ready', async () => {
    if (isReady === true) return
    isReady = true
    logger.print('===================================')
    logger.print('==   App is starting...')
    startApp()
    await deleyTime()
    // 做一个延时，防止未完全ready就开启触发兼听
    watcher.on('all', () => {
      if (tick) {
        clearTimeout(tick)
        tick = null
      }
      tick = setTimeout(async () => {
        console.log(chalk.blue('==================================='))
        console.log(chalk.blue('==   App is restarting...'))
        startApp()
      }, 1000)
    })
  })
}

(async () => {
  const tscRes = await satarTsc()
  if (tscRes) startWatcher()
})();