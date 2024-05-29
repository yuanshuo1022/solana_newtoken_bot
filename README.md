# solana_newtoken_bot
 solana监控新币、交易、监控交易池
# 项目架构
```
solana_newtoken_bot
├─ README.md
├─ swagger
│  └─ swagger.js  //api文档配置
├─ utils
│  ├─ common
│  │  └─ common.js //公共工具类方法
│  └─ blackchain
│     ├─ sol
│     │  └─ sol_utils.js // solana相关的一些方法
│     ├─ bsc
│     └─ eth
├─ app.js
├─ package.json
├─ service
│  ├─ bsc
│  ├─ sol
│  │  └─ connect.js  //rpc连接
│  └─ eth
├─ api
│  ├─ bsc
│  ├─ eth
│  └─ sol
│     └─ sol_api.js //solana api
├─ config
│  ├─ config.js
│  └─ config.prod.js
├─ public
└─ db
   └─ db.js

```

# 运行版本(参考)
```
node V18.17.0
npm  V10.3.0
```
# 运行
```
1、将envtest文件修改为.env
2、配置相关参数
3、npm install #安装依赖
4、node app.js #启动
```