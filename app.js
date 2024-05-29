// require('bytenode'); //编译为 V8 引擎的字节码
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const config = require('./config/config.js'); // 加载默认配置
const swaggerInit = require('./swagger/swagger.js');
const app = express();
swaggerInit(app)
if (process.env.NODE_ENV === 'production') {
    //进入生产环境
    const prodConfig = require('./config/config.prod.js');
    Object.assign(config, prodConfig); // 使用生产环境配置覆盖默认配置
}

// 导入你的不同 API 文件
const api_sol = require('./api/sol/sol_api.js');
// 将不同的 API 文件挂载到不同的路径上
app.use('/sol', api_sol);

// step1:安装依赖
// npm install web3@1.3.6 bignumber.js
// npm install web3
// step2:输入发起交易的钱包私钥
// step3:运行命令
// node app.js
let run = async () => {
    //启动服务器
    app.listen(18001, () => {
        console.log('Server started on port 18001');
    });
}

run()

