import moment from 'moment'
import config from '../../config'
import path from 'path'

// 时间格式化
const formatTime = (time: string | Date, format: string = config.app.timeFormat): string => {
  return moment(time).format(format)
}

// 计算根目录
const pathRoot = (dir: string = ''): string => {
  return path.resolve(__dirname, '../../../', dir)
}

export default {
  formatTime,
  pathRoot,
}