/**
 * 扩展express Response 接口
 */
import * as express from 'express';
import {PoolConnection as MysqlPoolConnection} from 'mysql'

declare global {
  namespace Express {
    interface Response {
      resp: {
        /**
       * 返回成功和消息实体
       * @param result 消息实体
       * @param extData 额外数据，可覆盖
       * @returns void
       */
        success: (result?: any, extData?: object) => void

        /**
         * 返回失败消息
         * @param msg 消息内容
         * @param code 错误码
         * @returns void
         */
        fail: (msg?: string, code?: number) => void

        /**
         * 返回提示消息
         * @param msg 消息内容
         * @returns void
         */
        info: (msg: string) => void

        /**
         * 返回分页数据
         * @param dataList 列表数据
         * @param total 总数
         */
        list: (dataList: Array<any>, total: number) => void
      }
    }
  }
  interface PoolConnection extends MysqlPoolConnection {
    exec: (sql: string, args: any) => Promise<any>
  }
}

