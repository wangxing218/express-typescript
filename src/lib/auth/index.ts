import { Request, Response, NextFunction } from "express"

/**
 * 权限验证中间间
 * @param {*} authKey 
 */

const Auth = (authKey: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log('权限key: ', authKey)
    const loginUser = req.session.loginUser
    console.log('loginUser', loginUser)
    if (!loginUser) {
      res.resp.fail('未登录')
      return
    } else if (authKey !== 'api.test') {
      return res.resp.fail('权限不足')
    }
    next()
  }
}


export default Auth