const nzd = require('node-zookeeper-dubbo')
import config from '../../config'
import dependencies from '../../config/dubbo'

const options = {
  application: { name: config.dubbo.name },
  registry: config.dubbo.registry,
  dubboVer: '2.8.4',
  timeout: 30000,
  dependencies,
}

const dubbo = new nzd(options)
// 链接成功
dubbo.client.once('connected', () => console.log('dubbo connected!'))
dubbo.client.on('disconnected', () => {
  // 断开
  throw Error('dubbo disconnected!')
})
dubbo.client.on('authenticationFailed', () => {
  // 无权限
  throw Error('dubbo authenticationFailed!')
})
dubbo.client.on('expired', () => {
  // 超时
  throw Error('dubbo timeout!')
})

// 在服务未就绪时，提供一套跳转方案
// const service = {}
// for (let key in dependencies) {
//   const methods = dependencies[key].methodSignature
//   service[key] = {}
//   for (let method in methods) {
//     service[key][method] = function () {
//       const args = arguments
//       return new Promise((resolve, reject) => {
//         serviceLoaded(key, method, res => {
//           if (res) {
//             res.apply(dubbo, args).then(resolve).catch(reject)
//           } else {
//             reject('dubbo连接超时')
//             throw Error('dubbo service not found!')
//           }
//         })
//       })
//     }
//   }
// }
// // 判断server服务是否已加载
// function serviceLoaded(key, method, callback, count = 0) {
//   count++
//   if (count > 20) callback(false)
//   if (dubbo[key] && dubbo[key][method]) {
//     callback(dubbo[key][method])
//   } else {
//     setTimeout(() => {
//       serviceLoaded(key, method, callback, count)
//     }, 100)
//   }
// }

export default dubbo