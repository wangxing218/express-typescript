import db from '../lib/db'

/**
 * 插入一个用户
 * @param {*} user 2131
 * @returns { Promise } 用户id
 */
interface UserDto {
  name: string
  userMail: string
  desc?: string
}
export const insertUser = (user:UserDto) => {
  // 开启事务操作
  return db.transaction(async conn => {
    const data = await conn.exec('insert into user set ?', {
      name: user.name,
      userMail: user.userMail
    })
    console.log('第一步：', data.insertId)
    const data2 = await conn.exec('insert into userinfo set ?', {
      uid: data.insertId,
      desc: user.desc
    })
    console.log('第二步：', data2)
    return data.insertId
  })
}

export default {
  insertUser,
}