import express, { Request, Response } from 'express'
const router = express.Router()
import cache from '../lib/cache'

router.get('/newsList/:name',async (req: Request,res: Response)=>{
  const name = await cache.get('userName').catch(err=>res.resp.fail(err))
  res.resp.success(name)
})

export default router
