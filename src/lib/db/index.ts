/**
 * 数据库操作类
 */
import mysql from 'mysql'
import config from '../../config'

const pool = mysql.createPool(config.db)

// 日志记录
pool.on('connection', () => console.log('mysql connected!'))
pool.on('error', (err:Error) => {
  console.warn('mysql error: ', err)
  throw err
})

// 执行sql语句
const query = (sql:string, args?: any):Promise<any> => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) {
        console.warn(err)
        return reject(err)
      }
      conn.query(sql, args, (err, rows) => {
        conn.release()
        if (err) {
          console.log(err)
          return reject(err)
        }
        resolve(rows)
      })
    })
  })
}

// 执行事务
const transaction = (handle:(conn: PoolConnection)=>Promise<any>) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn: PoolConnection) => {
      if (err) {
        console.warn(err)
        return reject(err)
      }
      conn.beginTransaction(() => {
        conn.exec = async (sql:string, args:any) => {
          return new Promise((resolve, reject) => {
            conn.query(sql, args, (err, rows) => {
              if (err) {
                console.warn(err)
                return reject(err)
              }
              resolve(rows)
            })
          })
        }
        handle(conn).then((res:any) => {
          conn.commit(err => {
            if (err) {
              console.warn(err)
              reject(err)
            }
            else {
              conn.release()
              resolve(res)
            }
          })
        }).catch((err:Error) => {
          conn.rollback(rollbackErr => {
            if (rollbackErr) {
              console.warn(rollbackErr)
              reject(rollbackErr)
            }
            else {
              console.warn(err)
              reject(err)
            }
          })
        })
      })
    })
  })
}

export default {
  query,
  transaction
}