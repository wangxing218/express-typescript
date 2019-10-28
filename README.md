# express后台开发框架简介

## 介绍 
- 基于express搭建的一款小巧、高性能、功能强大的后台开发框架；
- 整个应用实现TypeScript覆盖；
- 已集成开发、调试、构建、文件兼听等功能，无须依赖其他工具；

## 版本要求
- node >= 9.0
- TypeScript > 3.0 （内部已集成，可不用全局安装）
- vscode@last
- pm2 > 3.0 (生产环境使用)

  
## 目录规划
- |- .temp                缓存目录，存放日志，临时文件等
- |- .vscode              编辑器配置，代码片段
- |- bin                  开发环境启动脚本、构建脚本
- |- dist                 ts编译后的js代码
- |- public               静态目录
- |- src                  TypeScript源码
- |- |- config            配置文件，路由配置
- |- |- controller        控制器层
- |- |- lib               类库、中间件
- |- |- service           业务逻辑层
- |- |- types             ts定义文件
- |- |- app.ts            应用入口
- |- view                 视图模板
- |- pm2.json             PM2配置
- |- tsconfig.json        ts编译配置

## 开发环境
- 请修改 src/config 下的配置项，以符合自已的开发环境；
- 框架已集成typescript编译和调试环境，使用vscode编辑器开发时，按f5或点击debug启动即可；
- 调试的端口为13729，如有冲突，请修改 .vscode/launch.json对应的配置；
- 改动ts文件，应用会在1秒后重启，无须手动运行；

## 生产环境
- 运行命令 npm run build 编译ts脚本，会重新生成 dist目录；
- 打包dist,public,view,package.json,package-lock.json,pm2.json文件上传到服务器；
- 在根目录执行 npm install --production （有依赖包变动时就要执行）；
- 使用pm2启动或重启应用，pm2 start pm2.json 或 pm2 restart pm2.json；


## 联系我
有啥技术上的问题，可以与我交流
### QQ ： <a href="http://wpa.qq.com/msgrd?v=3&uin=1263996779&site=qq&menu=yes" target="_blank">1263996779</a>
### 如果对您有帮助，欢迎打赏
<img src="https://wangxing218.github.io/app-rem/test/wxpay.jpg">
