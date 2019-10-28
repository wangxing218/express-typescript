import db from '../lib/db'
import cache from '../lib/cache'

const getList = async (count: number = 10) => {
  const data = await cache.get('userList')
  if (data) {
    console.log('走了缓存')
    return data
  }
  console.log('无缓存')
  const result = await db.query(`
  select count(1) as total, name 
  from user 
  group by name 
  ORDER BY total DESC 
  limit ?
  `, [count])
  const total = await db.query(`
  SELECT count(1) as res FROM(select count(1) as total, name from user group by name) u;
  `)
  const resp = {
    total: total[0].res,
    result,
  }
  cache.set('userList', resp, 20)
  return resp


}

const add = async (info: object) => {
  const sql = `
  INSERT INTO user SET ?
  `
  const res = await db.query(sql, info)
  return res.insertId
}

export default {
  getList,
  add,
}