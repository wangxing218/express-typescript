/**
 * dubbo service列表
 */
import java from 'js-to-java'
import config from './index'


const pkg = 'com.test'
export default {
  User: {
    interface: `${pkg}.User`,
    group: config.dubbo.group,
    methodSignature: {
      add: (obj:object) => [java(`${pkg}.req.BaseRequest`, obj)],
      edit: (obj:object) => [java(`${pkg}.req.BaseRequest`, obj)],
    }
  }
}