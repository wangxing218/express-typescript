/**
 * 系统配置接口
 */
declare interface Config {
  // 系统配置
  readonly system?:{
    // 绑定ip或域名
    readonly host?: string
    // 端口，默认80
    readonly port?: number
    // 环境变量, 默认为 production
    readonly env?: 'development' | 'production' | 'test'
  }

  // session配置
  readonly session?: {
    // 名称
    readonly name?: string
    // 存取类型, 默认redis,如果是redis请正确配置redis
    readonly type?: 'redis' | 'file'
    // 有效时间，单位 s
    readonly ttl?: number
    // 加密密钥
    readonly secret?: string
  }

  // redis配置
  readonly redis?: {
    // 地址
    readonly host: 'localhost'
    // 端口，默认6379
    readonly port: number
    // 缓存前辍
    readonly prefix: string
    // 数据库，默认为0
    readonly db?: number | string
    // 授权码
    readonly password?: string
  }

  // 数据库存配置
  readonly db?: {
    // 类型,现只支持 mysql
    readonly type?: 'mysql'
    // 地址,默认localhost
    readonly host?: string
    // 端口，默认3306
    readonly port?: number
    // 数据库存
    readonly database: string
    // 用户名
    readonly user: string
    // 用户名
    readonly password: string
  }

  // dubbo配置
  readonly dubbo?: {
    // 名称
    name: string
    // 地址，如：127.0.0.1:2181
    registry: string
    // dubbo版本
    version?: string
    // 分组
    group?: string
  }

  // 业务配置
  readonly app?: any
}