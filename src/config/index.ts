/**
 * 基本配置项，（生产环境：prod），其他环境配置可在对应 .config.js文件中覆盖
 */
import extend from 'extend'

const config: Config = {
  // 系统配置
  system: {
    host: '127.0.0.1',
    port: 3002,
    env: 'production',
  },
  session: {
    name: 'SESSKEY',
    type: 'redis',
    secret: '0b8d3104f46ce1ce884d3c494fac1b65'
  },
  // redis
  redis: {
    host: 'localhost',
    port: 6379,
    db: 0,
    password: '123456',
    prefix: 'webapp:',
  },
  // mysql
  db: {
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'test',
    port: 3306,
  },
  // dubbo
  dubbo: {
    name: 'webapp',
    group: 'dev',
    registry: '127.0.0.1:2181',
  },
  // 业务
  app: {
    timeFormat: 'YYYY-MM-DD HH:mm:ss'
  },
}

/**
 * 不同环境配置覆盖
 */
let lastConfig = config
declare interface EnvFileObj {
  [key: string]: any
}
const env: string = process.env.NODE_ENV || 'production'
if (env !== 'production') {
  const envFileObj: EnvFileObj = {
    development: 'dev',
    test: 'test',
    production: 'prod',
  }
  let envFile: string = envFileObj[env]
  extend(true, lastConfig, config, require(`./${envFile}.config.js`).default)
}
export default config

