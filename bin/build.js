const fs = require('fs')
const childProcess = require('child_process')
const chalk = require('chalk').default


// var child = childProcess.exec(process.cwd() + '/node_modules/.bin/tsc -v')
// child.stdout.on('data',(data)=>console.log(data))


// ts编译子进程
let tsc = null

console.log(chalk.blue('Clear dist....'))
fs.rmdir('./dist', { recursive: true }, (err) => {
  if (err) throw err
  console.log(chalk.green('Clear ok! '))
  console.log(chalk.blue('Tsc is building, please wait...'))
  const startTime = Date.now()
  tsc = childProcess.exec(process.cwd() + '/node_modules/.bin/tsc -sourceMap false')
  tsc.stdout.on('data', data => {
    console.log(chalk.red(data))
  })
  tsc.stderr.on('data', data => {
    console.log(chalk.red(data))
  })
  tsc.on('error', data => {
    console.log(chalk.red(data))
  })
  // 编译结束
  tsc.on('close', (code, sigal) => {
    if (code === 0) {
      let time = ((Date.now() - startTime) /  1000 ).toFixed(2)
      console.log(chalk.green(`Time: ${time} s, Build success! `))
    } else {
      console.log(chalk.gray('Build failed, please check your code!...'))
    }
  })
})

