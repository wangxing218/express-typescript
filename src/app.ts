import express, { Request,Response } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import expressWs from 'express-ws'
import helmet from 'helmet'
import connectRedis from 'connect-redis'
import sessionFile from 'session-file-store'
import cache from './lib/cache'
import response from './lib/response'
import util from './lib/util'
import config from './config'
const app = express()


/**
 * 组件设置
 */
app.use(helmet())
app.use(cookieParser())
if(config.session.type === 'redis'){
  const redisStore = connectRedis(session)
  app.use(session({
    saveUninitialized: false,
    secret: config.session.secret,
    resave: true,
    store: new redisStore({
      client: cache.client,
      ttl: config.session.ttl
    }),
    name: config.session.name
  }))
}else{
  const fileStore = sessionFile(session)
  app.use(session({
    saveUninitialized: false,
    secret: config.session.secret,
    resave: true,
    store: new fileStore({
      path: '.temp/sessions',
      ttl: config.session.ttl
    }),
    name: config.session.name
  }))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(response())
app.use(express.static(util.pathRoot('public')))
app.set('view engine', 'ejs')
app.set('views', util.pathRoot('view'))
if (app.get('env') === 'development') {
  // json美化
  app.set('json spaces', 2)
}

// 开启websocket,之后才能引入路由
expressWs(app)
// 路由
import router from './config/router'
router(app)

// 404重定向，单页应用时可转发到首页
app.get('*', (req: Request, res: Response) => {
  res.sendFile(util.pathRoot('public/index.html'))
})

// 统一错误捕获
app.use((err: Error, req: Request, res: Response) => {
  console.warn('system has error：', err)
  res.resp.fail(err.toString())
})


// 兼听
app.listen(config.system.port, config.system.host, () => {
  console.log(`App is running at: http://${config.system.host}:${config.system.port}`)
  console.log('Current enviroment: ', app.get('env'))
})