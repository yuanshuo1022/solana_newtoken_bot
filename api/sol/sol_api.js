const express = require('express');
const app = express();
let initializeSolDeal = require("../../service/sol/deal")
let initMonitor = require("../../service/sol/monitor")
 
// 解析 JSON 请求体
app.use(express.json());

(async () => {
    try {
  
        const SolDealService = await initializeSolDeal();
        const monitorService = await initMonitor()
        monitorService.monitor_raydium_newpool()
        monitorService.monitor_pump_newtoken()
        monitorService.test_increase() //test
        //通过代币地址获取代币价格 JUPTER
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

        //通过代币symbol获取价格 MERTCOIN
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

        //获取pump代币的价格K线 PUMP
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

        //获取交易对 JUPTER
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

        //swap交易 JUPTER
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
        //转账 COMMON
        app.post('/transfer', async (req, res) => {
            try {
                const { toAddress, amount, privateKey } = req.body;

                if (!toAddress || !amount || !privateKey) {
                    return res.status(400).json({ error: 'Missing required parameters' });
                }

                const params = { toAddress, amount, privateKey };
                const transferResult = await SolDealService.transferSol(params);

                res.status(200).json({ confirmation: transferResult });
            } catch (error) {
                console.error('Error during SOL transfer:', error);
                res.status(500).json({ error: 'Internal Server Error', details: error.message });
            }
        });
        //获取代币余额 COMMON
        app.post('/get-token-balance', async (req, res) => {
            try {
                const { publicKey, mintAccount } = req.body;

                if (!publicKey || !mintAccount) {
                    return res.status(400).json({ error: '缺少必要的参数' });
                }

                const params = { publicKey, mintAccount };
                const tokenBalance = await SolDealService.getTokenBalance(params)

                res.status(200).json({ balance: tokenBalance });
            } catch (error) {
                console.error('Error during token balance query:', error);
                res.status(500).json({ error: '服务器内部错误', details: error.message });
            }
        });
        //获取sol余额 COMMON
        app.post('/get-sol-balance', async (req, res) => {
            try {
                const { publicKey } = req.body;

                if (!publicKey) {
                    return res.status(400).json({ error: 'Missing required parameter: publicKey' });
                }
                const params = { publicKey };
                const balance = await SolDealService.getSolBalance(params);
                res.status(200).json({ balance });
            } catch (error) {
                console.error('Error fetching SOL balance:', error);
                res.status(500).json({ error: 'Internal Server Error', details: error.message });
            }
        });
        //通过代币地址获取pump代币信息
        app.get('/pump-tokeninfo', async (req, res) => {
            try {
                const ids = req.query.ids;
                if (!ids) {
                    return res.status(400).json({ error: 'Missing required parameter: ids' });
                }

                const params = { ids: ids };
                const data = await SolDealService.getPumpTokenInfo(params);
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
        //购买pump代币
        app.post('/pump-buy', async (req, res) => {
            try {
                const { privateKey, ids, solAmount, priorityFeeInSol, slippageDecimal } = req.body;
                if (!privateKey || !ids || solAmount === undefined || priorityFeeInSol === undefined || slippageDecimal === undefined) {
                    return res.status(400).json({ error: 'Missing required parameters' });
                }
        
                const params = { privateKey, ids, solAmount, priorityFeeInSol, slippageDecimal };
                const data = await SolDealService.pumpBuyToken(params);
                res.status(200).json(data);
            } catch (error) {
                console.error('Error performing pump buy:', error);
                res.status(500).json({ error: 'Internal Server Error', details: error.message });
            }
        });
        //出售pump代币
        app.post('/pump-sell', async (req, res) => {
            try {
                const { privateKey, ids, tokenAmount, priorityFeeInSol, slippageDecimal } = req.body;
                if (!privateKey || !ids || tokenAmount === undefined || priorityFeeInSol === undefined || slippageDecimal === undefined) {
                    return res.status(400).json({ error: 'Missing required parameters' });
                }
        
                const params = { privateKey, ids, tokenAmount, priorityFeeInSol, slippageDecimal };
                const data = await SolDealService.pumpsellToken(params);
                res.status(200).json(data);
            } catch (error) {
                console.error('Error performing pump sell:', error);
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
    // process.exit(1);
});

module.exports = app