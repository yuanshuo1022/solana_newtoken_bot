const express = require('express');
const app = express();
let initializeSolDeal = require("../../service/sol/deal")


// 解析 JSON 请求体
app.use(express.json());

(async () => {
    try {
        const SolDealService = await initializeSolDeal();
        
        //通过代币地址获取代币价格
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

        //通过代币symbol获取价格
        app.get('/price-by-symbol', async (req, res) => {
            try {
                const ids = req.query.symbol;
                if (!ids) {
                    return res.status(400).json({ error: 'Missing required parameter: symbol' });
                }
                const params = { ids: ids };
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

        //获取pump代币的价格K线
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

        //获取交易对
        app.post('/get-amounts', async (req, res) => {
            try {
                const { inputMint, outputMint, amount, slippageBps } = req.body;
                if (!inputMint || !outputMint || !amount || slippageBps === undefined) {
                    return res.status(400).json({ error: 'Missing required parameters' });
                }
                const params = { inputMint, outputMint, amount, slippageBps };
                const data = await SolDealService.getMinAmounts(params);
                res.status(200).json(data);
            } catch (error) {
                console.error('Error fetching min amounts:', error);
                res.status(500).json({ error: 'Internal Server Error', details: error.message });
            }
        });

        //swap交易
        app.post('/token-swap', async (req, res) => {
            try {
                const { inputMint, outputMint, amount, slippageBps, privateKey } = req.body;
        
                if (!inputMint || !outputMint || !amount || slippageBps === undefined || !privateKey) {
                    return res.status(400).json({ error: 'Missing required parameters' });
                }
        
                const params = { inputMint, outputMint, amount, slippageBps, privateKey };
                const swapResult = await SolDealService.tokenSwap(params);
        
                res.status(200).json(swapResult);
            } catch (error) {
                console.error('Error during token swap:', error);
                res.status(500).json({ error: 'Internal Server Error', details: error.message });
            }
        });

    } catch (error) {
        console.error('Failed to initialize SolDealService:', error);
        process.exit(1); // Exit the process with a failure code
    }
})();

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