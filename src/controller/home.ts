import express,{ Request,Response } from 'express'
import mock from 'mockjs'
import auth from '../lib/auth'
import { check, validationResult, oneOf } from 'express-validator'
const router = express.Router()

router.get('/', async (req:Request, res:Response) => {
  req.app.locals.webtitle = '<b>这是个标题: </b>' + req.ip
  var a = 100, b= 12321
  var c = b / a

  res.render('home', {
    title: 'Home page 1111',
    session: req.session,
    dataList: [{
      id: 12321,
      name: '张三A111',
      age: 13
    }, {
      id: 12,
      name: '1231321',
      age: 111
    }],
  })
})

/**
 * 测试字段验证
 */
router.post('/check', [
  check('name', '名称必填').trim().isLength({min: 1}),
  oneOf([
    check('tel').trim().isEmpty(),
    check('tel').isMobilePhone('zh-CN')
  ], '手机号错误')
], (req:Request, res:Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const msg = errors.array()[0].msg
    res.resp.fail(msg)
    return
  }
  res.resp.success('验证通过' + req.body.tel)
})


router.get('/login', (req:Request, res:Response) => {
  req.session.loginUser = '张三'
  res.resp.success(req.session.loginUser)
})

router.get('/test', auth('api.test'), (req:Request, res:Response) => {
  var name = req.query.age
  res.resp.success(req.session.loginUser)
})

// mock数据
router.get('/mock', (req:Request, res:Response) => {
  const md5 = require('crypto').createHash('md5')
  let data = md5.update('123456').digest('hex')
  return res.resp.success(mock.mock({
    id: '@id',
    name: '@cname',
    data,
    session: req.session.vcode,
    env: process.env.NODE_ENV
  }))
})



export default router