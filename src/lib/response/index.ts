/**
 * 统一格式返回
 */
import { Request,Response, NextFunction } from 'express'

export default () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    res.resp = {
      //  成功
      success(result: any, extData: object = {}) {
        return res.json({
          code: 200,
          msg: '成功',
          fail: false,
          result,
          ...extData,
        })
      },
      // 失败
      fail(msg = '失败', code = 300) {
        return res.json({
          code,
          msg,
          fail: true
        })
      },
      // 返回提示信息
      info(msg) {
        return this.success(undefined, {
          msg
        })
      },
      // 返回分页数据
      list(dataList: Array<any> = [], total: number = 0) {
        return this.success(dataList, {
          total
        })
      }
    }
    next()
  }
}
