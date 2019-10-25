import express from 'express'
const router = express.Router()

const wsGroup: any[] = []

// 广播所有消息 
const postMsg = (msg: any) => {
  wsGroup.map(item => {
    item.ws.send(JSON.stringify(msg))
  })
}

router.ws('/ws', (ws, req) => {
  console.log('connected')
  wsGroup.push({
    user: wsGroup.length,
    ws,
  })
  postMsg({
    count: wsGroup.length
  })
  ws.send(JSON.stringify({
    msg: 'connected',
    sessionId: req.cookies.SID
  }))
  ws.on('message', msg => {
    console.log(msg)
  })
  ws.on('close', () => {
    console.log('closed', req.cookies.SID)
    let index = -1
    for (let i = 0, l = wsGroup.length; i < l; i++) {
      if (ws === wsGroup[i].ws) {
        index = i
        break
      }
    }
    if (index > -1) {
      wsGroup.splice(index, 1)
      postMsg({
        count: wsGroup.length
      })
    }
  })
})

export default router