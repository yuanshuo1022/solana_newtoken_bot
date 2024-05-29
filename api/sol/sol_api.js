const express = require('express');
const app = express();
let SolDeal = require("../../service/sol/deal")
let SolDealService = new SolDeal();

// 解析 JSON 请求体
app.use(express.json());

app.get('/price', async (req, res) => {
    try {
        const ids = req.query.ids;
        if (!ids) {
            return res.status(400).json({ error: 'Missing required parameter: ids' });
        }

        const params = { ids: ids };
        const data = await SolDealService.getTokenJupterPrice(params);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching price:', error);
        if (error.message.includes('Network response was not ok')) {
            res.status(502).json({ error: 'Bad Gateway', details: error.message });
        } else {
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }
});

app.get('/price-by-symbol', async (req, res) => {
    try {
        const ids = req.query.symbol;
        if (!ids) {
            return res.status(400).json({ error: 'Missing required parameter: ids' });
        }
        const params = { ids: symbol };
        const data = await SolDealService.getTokenMarketCapPrice(params);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching price:', error);
        if (error.message.includes('Network response was not ok')) {
            res.status(502).json({ error: 'Bad Gateway', details: error.message });
        } else {
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }
});

/**
 * @swagger
 * /sol/price-pump:
 *   get:
 *     summary: 获取pump代币的价格K线 
 *     description: 获取pump代币的价格K线，数组中数据间隔5分钟
 *     parameters:
 *       - in: query
 *         name: ids
 *         schema:
 *           type: string
 *         required: true
 *         description: Comma-separated token IDs
 *     responses:
 *       200:
 *         description: Successfully fetched token prices
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *
 */
app.get('/price-pump', async (req, res) => {
    try {
        const ids = req.query.ids;
        if (!ids) {
            return res.status(400).json({ error: 'Missing required parameter: ids' });
        }

        const params = { ids: ids };
        const data = await SolDealService.getPumpPrice(params);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching price:', error);
        if (error.message.includes('Network response was not ok')) {
            res.status(502).json({ error: 'Bad Gateway', details: error.message });
        } else {
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }
});



// 全局处理未捕获的异常
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // 你可以选择关闭进程，或在这里处理其他清理工作
    process.exit(1);
});

// 全局处理未处理的拒绝
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
    // 你可以选择关闭进程，或在这里处理其他清理工作
    process.exit(1);
});

module.exports = app