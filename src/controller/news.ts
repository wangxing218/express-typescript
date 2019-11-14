import express, { Request, Response } from 'express'
import mock from 'mockjs'
const router = express.Router()
import cache from '../lib/cache'
import mockjs from 'mockjs'

router.get('/newsList/:name', async (req: Request, res: Response) => {
  const name = await cache.get('userName').catch(err => res.resp.fail(err))
  res.resp.success(name)
})

router.get('/news/user', async (req: Request, res: Response) => {
  const user: Msg<User> = mock.mock({
    code: 200,
    msg: '成功',
    result: {
      'id': '@id',
      'userName': '@cname',
      'age|1-100': 12
    }
  })
  res.json(user.result)
})

export default router
