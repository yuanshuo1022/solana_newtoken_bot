const { LIQUIDITY_STATE_LAYOUT_V4, MARKET_STATE_LAYOUT_V3, Token, TokenAmount } = require('@raydium-io/raydium-sdk');
const dotenv = require('dotenv');
const ConnectRPC = require('./connect');
const SolUtils = require('../../utils/blackchain/sol/sol_utils');
const initializeSolDeal = require('./deal')
const { PublicKey } = require('@solana/web3.js');
dotenv.config();
const SOL_PUMP_PUBLIC_KEY = process.env.SOL_PUMP_PUBLIC_KEY
const ENDPOINT_SOL = JSON.parse(process.env.ENDPOINT_SOL) //PRC


async function initMonitor() {
    const connection = await ConnectRPC.connection(ENDPOINT_SOL);
    // 初始化 sol_deal 实例
    const solDealInstance = await initializeSolDeal();
    let lastSignature = null;
    class sol_monitor {
        //监听pump发行的新代币

        async monitor_pump_newtoken() {
            try {
                console.log("------------监控PUMP代币发行----------------")
                const TOKEN_PROGRAM_ID = new PublicKey(SOL_PUMP_PUBLIC_KEY)
                connection.onLogs(
                    TOKEN_PROGRAM_ID,
                    async ({ logs, err, signature }) => {
                        if (err) return;
                        if (logs && logs.some(log => log.includes("InitializeMint2"))) {
                            //解析交易
                            if (lastSignature == signature) {
                                return
                            }
                            lastSignature = signature
                            console.log("签名", signature)
                            await this.PumpTranction(connection, signature)
                        }
                    },
                    "finalized"
                );
            } catch (error) {
                console.log(error)
                return error
            }
        }
        async PumpTranction(connection, txid) { //connection
            // const connection = await rpcConnector.connect();
            try {
                const response = await connection.getTransaction(txid, {
                    commitment: "confirmed",
                    maxSupportedTransactionVersion: 0,
                });
                const ids = await SolUtils.findUiTokenAccount(response.meta.postTokenBalances)
                const params = { ids: ids };
                //获取代币信息
                const info = await solDealInstance.getPumpTokenInfo(params)
                // const info = await this.getTokenMetadata(connection,tokenAccount)
                console.log(info)
                //获取代币价格K线
                // const infoKline=await solDealInstance.getPumpPrice(params)
                console.log(infoKline)
                //ws或者队列操作

                //数据库操作



                return info
            } catch (error) {
                return error
            }


        }
    }
    return new sol_monitor()
}
module.exports = initMonitor;
