# solana_newtoken_bot
 solana监控新币、交易、监控交易池
项目结构：
```
solana_newtoken_bot
├─ README.md
├─ swagger
│  └─ swagger.js
├─ utils
│  ├─ common
│  └─ blackchain
│     ├─ sol
│     │  └─ sol_utils.js
│     ├─ bsc
│     └─ eth
├─ app.js
├─ package.json
├─ service
│  ├─ bsc
│  ├─ sol
│  └─ eth
├─ api
│  ├─ bsc
│  ├─ eth
│  └─ sol
│     └─ sol_api.js
├─ config
│  ├─ config.js
│  └─ config.prod.js
├─ public
└─ db
   └─ db.js
```