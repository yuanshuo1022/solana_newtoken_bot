
const express = require('express');
const app = express();
let initMonitor = require("../../service/eth/ethTest")
// 解析 JSON 请求体
app.use(express.json());

ethTest()
