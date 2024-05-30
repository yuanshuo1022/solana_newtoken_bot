const { Connection, Keypair, VersionedTransaction, Transaction, SystemProgram, PublicKey, SolanaJSONRPCError, sendAndConfirmTransaction } = require('@solana/web3.js');
const dotenv = require('dotenv');
const bs58 = require('bs58');
const spl_token = require('@solana/spl-token')
const ConnectRPC = require('./connect');
const SolUtils = require('../../utils/blackchain/sol/sol_utils');
const CommonUtils = require('../../utils/common/common');
dotenv.config();
const ENDPOINT_SOL = JSON.parse(process.env.ENDPOINT_SOL) //PRC
const JUPITER_V4_URL = process.env.JUPITER_V4_URL //JUPITER V4 URL
const JUPITER_V6_URL = process.env.JUPITER_V6_URL ////JUPITER V6 URL
const USDC_ACCOUNT = process.env.USDC_ACCOUNT //USDC 代币地址
const COIN_MARKET_CAP_BASE_URL = process.env.COIN_MARKET_CAP_BASE_URL //coin market cap  url
async function initializeSolDeal() {
    const connection = await ConnectRPC.connection(ENDPOINT_SOL);
    class sol_deal {

        //获取代币价格 jupter swap api
        async getTokenJupterPrice(params) {
            try {
                const ids = params.ids;
                const url = `${JUPITER_V4_URL}price?ids=${ids}&vsToken=${USDC_ACCOUNT}`;
                const data = await CommonUtils.fetchResJson(url)
                return data;
            } catch (error) {
                console.error(error)
                throw error;
            }
        }
        //获取代币价格 coin market cap
        async getTokenMarketCapPrice(params) {
            try {
                const ids = params.ids;
                const url = `${COIN_MARKET_CAP_BASE_URL}cryptocurrency/quotes/latest?symbol=${ids}&convert=USD`
                // const url = `https://api.coinmarketcap.com/dexer/v3/dexer/pair-info?dexer-platform-name=solana&address=${ids}`; //?symbol=${ids}&convert=USD
                let config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: url,
                    timeout: 6000,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_CAP_API_KEY
                    },
                };
                const data = await CommonUtils.fetchWithRetry(config)
                return data;
            } catch (error) {
                console.error(error)
                throw error;
            }
        }
        //获取pump代币价格
        async getPumpPrice(params) {
            const ids = params.ids;
            try {
                let config = {
                    method: 'GET',
                    maxBodyLength: Infinity,
                    url: `https://client-api-2-74b1891ee9f9.herokuapp.com/candlesticks/${ids}`,
                };
                const data = await CommonUtils.fetchWithRetry(config)
                return data;
            } catch (error) {
                throw error;
            }
        }
        //获取交易对
        async getMinAmounts(params) {
            try {
                const inputMint = params.inputMint         //输入代币地址
                const outputMint = params.outputMint        //输出代币地址
                const amount = params.amount
                console.log("amount", amount)
                const slippageBps = params.slippageBps * 100     //滑点
                // const platformFeeBps = params.platformFeeBps // 平台费用、收手续费
                const inputMintDecimals = await SolUtils.getTokenMetadataDecimals(connection, inputMint)
                const outputMintDecimals = await SolUtils.getTokenMetadataDecimals(connection, outputMint)
                const amountSol = amount * Math.pow(10, inputMintDecimals);
                //构造请求url
                const url = `${JUPITER_V6_URL}quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amountSol}&slippageBps=${slippageBps}`   //&platformFeeBps=${platformFeeBps}
                console.log("url: ", url)
                // 发起网络请求
                const quote = await CommonUtils.fetchResJson(url)
                const res = {
                    quote: quote,
                    outputMint: outputMint,
                    outputMintDecimals: outputMintDecimals
                }
                return res;
            } catch (error) {
                console.log("error", error)
                return error;
            }
        }

    }
    return new sol_deal()
}
module.exports = initializeSolDeal;