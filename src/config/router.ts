/**
 * 路由集中处理
 */
import { Express } from 'express'

// 引入路由
import home from '../controller/home'
import user from '../controller/user'
import news from '../controller/news'
import ws from '../controller/ws'

// 挂载
export default (app: Express) => {
  app.use('/api', home)
  app.use('/api/user', user)
  app.use('/api', news)
  app.use('/api', ws)
}