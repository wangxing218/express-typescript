/**
 * redis缓存操作类
 */
import redis from 'redis'
import config from '../../config'

const client = redis.createClient(config.redis)

// 日志记录
client.on('connected', ()=>console.log('redis connected!'))
client.on('error', err => {
  console.error('redis error: ', err)
  throw err
})

const Cache = {
  client,
  /**
   * 获取缓存
   * @param {*} key 
   * @returns {*} any
   */
  get(key: string): Promise<any> {
    return new Promise(resolve => {
      client.get(key, (err, value) => {
        if (err) return resolve(null)
        resolve(JSON.parse(value))
      })
    })
  },
  /**
   * 设置缓存
   * @param {*} key 
   * @param {*} value 
   * @param {*} duration 
   * @returns {*} boolean
   */
  set(key: string, value: any, duration?: number): Promise<boolean> {
    return new Promise(resolve => {
      const callback = (err: Error, resp: string): void => {
        if (resp === 'OK') resolve(true)
        else resolve(false)
      }
      const lastVal: string = JSON.stringify(value)
      if (duration) {
        client.set(key, lastVal, 'EX', duration, callback)
      } else {
        client.set(key, lastVal, callback)
      }
    })
  },
  /**
   * 删除一个缓存
   * @param {*} ...keys
   */
  del(): Promise<Error | number> {
    return new Promise((resolve, reject) => {
      client.del(...arguments, (err: Error, total: number) => {
        if (err) reject(err)
        else resolve(total)
      })
    })
  }
}

export default Cache