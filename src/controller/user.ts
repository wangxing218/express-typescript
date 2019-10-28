import express,{ Request, Response } from 'express'
import util from '../lib/util'
import { insertUser } from '../service/transaction'
import multer from 'multer'
import userService from '../service/user'
const router = express.Router()

router.get('/', (req:Request, res:Response)=>{
  res.render('login', {
    title: '登录'
  })
})

// 事务测试
router.get('/trans', async (req:Request, res:Response, next) => {
  const userId = await insertUser({
    name: '正式的',
    userMail: '123131@qq.com',
    desc: '这个好'
  }).catch(next)
  userId && res.resp.success({
    userId,
  })
})

router.get('/err', (req:Request, res:Response) => {
  res.send('err')
})

// 验证码
router.get('/vcode', (req:Request, res:Response) => {
  const svgCaptcha = require('svg-captcha')
  const captcha = svgCaptcha.create({
    color: '#0080ff',
    background: '#f2f6fc',
    height: 40,
    width: 126,
  })
  req.session.vcode = captcha.text
  res.type('svg')
  res.send(captcha.data)
})

// 登录操作
router.post('/login', async (req, res:Response) => {
  // 上传文件
  const upload = multer({
    dest: util.pathRoot('.temp/upload'),
    fileFilter(req, file, callback) {
      callback(Error('不允许哦'), false)
    }
  }).single('file')

  upload(req, res, err => {
    console.log(err)
    const file = req.file
    if (file) {
      const target = util.pathRoot(file.path)
      const dist = util.pathRoot(`public/upload/${file.filename}.png`)
    } else {
      res.resp.success({
        post: req.body,
        vcode: req.session.vcode
      })
    }
  })

})

// 看看json和jsonp请求
router.post('/json', (req:Request, res:Response) => {
  res.json({
    data: req.body
  })
})

// 获取列表
router.get('/list', async (req:Request, res:Response) => {
  const dataList = await userService.getList(parseInt(req.query.count)).catch(err=>{
    res.resp.fail(err)
  })
  res.resp.list(dataList.result, dataList.total)
})

// 添加一个用户
router.get('/add', async (req:Request, res:Response) => {
  const info = {
    name: req.query.name,
    userMail: req.query.mail,
  }
  const total = await userService.add(info)
  res.resp.info(total)
})


export default router