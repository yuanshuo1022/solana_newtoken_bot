# solana_newtoken_bot
 solana监控新币、交易、监控交易池
# 项目架构
```
solana_newtoken_bot
├─ README.md
├─ swagger
│  └─ swagger.js  //api接口说明
├─ utils
│  ├─ common
│  │  └─ common.js //公共工具类方法
│  └─ blackchain
│     ├─ sol
│     │  ├─ sol_utils.js  // solana相关的一些方法
│     │  ├─ transactionSender.js
│     │  ├─ getSignature.js
│     │  ├─ wait.js
│     │  ├─ pumpswap.js
│     │  └─ pupmswapUtils // pump交易方法
│     │     ├─ utils.js
│     │     └─ constants.js
│     ├─ bsc
│     └─ eth
├─ app.js
├─ package.json
├─ service
│  ├─ bsc
│  ├─ sol
│  │  ├─ connect.js //rpc连接
│  │  ├─ monitor.js
│  │  └─ deal.js
│  └─ eth
├─ api
│  ├─ bsc
│  ├─ eth
│  └─ sol
│     ├─ sol_api.js //solana api
│     └─ swagger
│        └─ swagger_sol_api.js  //api文档配置
├─ config
│  ├─ config.js
│  └─ config.prod.js //生产环境
├─ public
├─ db
│  ├─ db.js
│  ├─ pump_kline.js
│  ├─ insert_pump_token.js
│  ├─ test_mint_increase.js
│  └─ insert_raydium_newpool.js
├─ envtest
├─ test
├─ ws
│  └─ webSocketService.js  //wenscoket服务
└─ sql
   └─ newtoken.sql  //数据库结构 sql

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
