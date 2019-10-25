import express, { Request, Response } from 'express'
const router = express.Router()


router.get('newsList/:name',(req: Request,res: Response)=>{
  req.file
  res.resp.fail('这个好吗')
})

export default router
