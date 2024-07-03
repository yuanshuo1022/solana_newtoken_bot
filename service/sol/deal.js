const { VersionedTransaction, Transaction, SystemProgram, PublicKey } = require('@solana/web3.js');
const dotenv = require('dotenv');
const bs58 = require('bs58');
const spl_token = require('@solana/spl-token')
const ConnectRPC = require('./connect');
const SolUtils = require('../../utils/blackchain/sol/sol_utils');
const pumpUtils=require('../../utils/blackchain/sol/pumpswap')
const CommonUtils = require('../../utils/common/common');
const transactionSenderAndConfirmationWaiter = require("../../utils/blackchain/sol/transactionSender")
const getSignature = require("../../utils/blackchain/sol/getSignature")
dotenv.config();
const LAMPORTS_PER_SOL = process.env.LAMPORTS_PER_SOL;
const ENDPOINT_SOL = JSON.parse(process.env.ENDPOINT_SOL) //PRC
const JUPITER_V4_URL = process.env.JUPITER_V4_URL //JUPITER V4 URL
const JUPITER_V6_URL = process.env.JUPITER_V6_URL ////JUPITER V6 URL
const USDC_ACCOUNT = process.env.USDC_ACCOUNT //USDC 代币地址
const COIN_MARKET_CAP_BASE_URL = process.env.COIN_MARKET_CAP_BASE_URL //coin market cap  url
async function initializeSolDeal() {
    const connection = await ConnectRPC.connection(ENDPOINT_SOL);
    class sol_deal {
        /*
        COMMON 相关
        */
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
        //查询sol余额
        async getSolBalance(params) {
            const publicKey = new PublicKey(params.publicKey);
            const balance = await connection.getBalance(publicKey);
            return balance;
        }
        //查询代币余额
        async getTokenBalance(params) {
            const TokenBalance = await SolUtils.getTokenBalance(connection, params.publicKey, params.mintAccount);
            return TokenBalance;
        }
        //转账
        async transferSol(params) {
            const privateKey = params.privateKey
            const wallet = await SolUtils.connectWallt(privateKey)
            const balance = await connection.getBalance(wallet.publicKey);
            const fromAddress = wallet.publicKey.toString()
            const toAddress = params.toAddress
            const amount = params.amount

            if (balance < amount * LAMPORTS_PER_SOL) {
                console.error("交易余额不足")
            }
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: new PublicKey(fromAddress),
                    toPubkey: new PublicKey(toAddress),
                    lamports: amount * LAMPORTS_PER_SOL,
                })
            );
            const signature = await connection.sendTransaction(transaction, [wallet.payer]);
            // 等待交易确认
            const tx = await connection.confirmTransaction(signature);
            console.log('Transaction confirmed:', signature);
            return tx;
        }

        /*
        JUPTER平台 相关
        */
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
        //获取交易对输出的最小数量 jupter
        async getMinAmounts(params) {
            try {
                const inputMint = params.inputMint         //输入代币地址
                const outputMint = params.outputMint        //输出代币地址
                const amount = params.amount
                const slippageBps = params.slippageBps * 100     //滑点
                // const platformFeeBps = params.platformFeeBps // 平台费用、收手续费
                const inputMintDecimals = await SolUtils.getTokenMetadataDecimals(connection, inputMint)
                const outputMintDecimals = await SolUtils.getTokenMetadataDecimals(connection, outputMint)
                const amountSol = amount * Math.pow(10, inputMintDecimals);
                //构造请求url
                const url = `${JUPITER_V6_URL}quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amountSol}&slippageBps=${slippageBps}`   //&platformFeeBps=${platformFeeBps}
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
        //初始化兑换买入交易 jupter
        async initswap(params, wallet) {
            try {
                const res = await this.getMinAmounts(params)
                const quote = res.quote
                const config = {
                    method: 'POST',
                    url: `${JUPITER_V6_URL}swap`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        // Payload for the swap
                        quoteResponse: quote,
                        userPublicKey: wallet.publicKey.toString(),
                        wrapAndUnwrapSol: true,
                        dynamicComputeUnitLimit: true,
                        prioritizationFeeLamports: 'auto'
                        // feeAccount,
                    })
                };
                const swapTransaction = await CommonUtils.fetchWithRetry(config)
                return swapTransaction
            } catch (error) {
                console.error(error);
                return error;
            }
        }

        //swap 交易 jupter
        async tokenSwap(params) {
            let txSwap
            try {
                // const platformPayeeAddress = params.platformPayeeAddress //手续费接收地址
                // const platformTrFee = params.platformTrFee   //手续费
                const privateKey = params.privateKey
                const wallet = await SolUtils.connectWallt(privateKey)
                const swapTransaction = await this.initswap(params, wallet)
                //序列化参数
                const swapTransactionBuf = Buffer.from(swapTransaction.swapTransaction, 'base64');
                var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
                const blockhash = transaction.message.recentBlockhash;
                //签名交易 sign the transaction
                transaction.sign([wallet.payer]);
                const signatrue = await getSignature(transaction)
                console.log("signatrue", signatrue)
                //验证交易是否合法
                const { value: simulatedTransactionResponse } = await connection.simulateTransaction(transaction, {
                    replaceRecentBlockhash: true,
                    commitment: "processed",
                })
                const { err, logs } = simulatedTransactionResponse;

                if (err) {
                    console.error("Simulation Error:");
                    console.error({ err, logs });
                    return { err, logs };
                }
                //反序列化交易 Execute the transaction
                const rawTransaction = transaction.serialize()
                const blockhashWithExpiryBlockHeight = {
                    blockhash,
                    lastValidBlockHeight: swapTransaction.lastValidBlockHeight,
                }
                const serializedTransaction = Buffer.from(rawTransaction);
                //提交执行交易
                console.log('开始confirmTransaction：');
                txSwap = await transactionSenderAndConfirmationWaiter({ connection, serializedTransaction, blockhashWithExpiryBlockHeight });
                let mintAccount = await CommonUtils.isEquals(params.inputMint, process.env.SOL_Token_Address, params.outputMint, params.inputMint)
                const postTokenBlance = await SolUtils.findUiTokenAmount(wallet.publicKey.toString(), mintAccount, txSwap.meta.postTokenBalances)
                const preTokenBalnace = await SolUtils.findUiTokenAmount(wallet.publicKey.toString(), mintAccount, txSwap.meta.preTokenBalances)
                const postBalance = txSwap.meta.postBalances[0]
                const preBlance = txSwap.meta.preBalances[0]
                const solAmount = postBalance - preBlance
                const tokenAmount = postTokenBlance.uiAmount - preTokenBalnace.uiAmount
                return {
                    url: 'https://solscan.io/tx/' + signatrue,
                    transactionHash: signatrue, //交易hash
                    gasfee: txSwap.meta.fee,
                    postTokenBlance: postTokenBlance,
                    preTokenBalnace: preTokenBalnace,
                    solAmount: solAmount / LAMPORTS_PER_SOL,
                    tokenAmount: tokenAmount,
                    txSwap: txSwap,
                    err: txSwap.meta.err
                }
            } catch (error) {
                console.log(error);
                const res = {
                    error: error.message ? error.message : error,
                    transactionHash: txSwap
                }
                throw res;
            }
        }


        /*
        * PUMP平台 
        */
        //获取pump代币价格
        async getPumpPrice(params) {
            const ids = params.ids;
            try {
                let config = {
                    method: 'GET',
                    maxBodyLength: Infinity,
                    url :`https://frontend-api.pump.fun/candlesticks/${ids}`
                    // url: `https://client-api-2-74b1891ee9f9.herokuapp.com/candlesticks/${ids}`,
                };
                const data = await CommonUtils.fetchWithRetry(config)
                return data;
            } catch (error) {
                throw error;
            }
        }

        //获取pump代币信息
        async getPumpTokenInfo(params) {
            const ids = params.ids;
            try {
                let config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url:`https://frontend-api.pump.fun/coins/${ids}`,
                    // url: `https://client-api-2-74b1891ee9f9.herokuapp.com/coins/${ids}`,
                    headers: {},
                    timeout: 3000
                };
                const data = await CommonUtils.fetchWithRetry(config)
                return data;
            } catch (error) {
                console.log(error)
            }
        }
        //购买pump代币
        async pumpBuyToken(params) {
            const { privateKey, ids, solAmount, priorityFeeInSol, slippageDecimal } = params;
            const paraminfo = { ids: ids };
            const coinData = await this.getPumpTokenInfo(paraminfo);
            const signature = await pumpUtils.pumpFunBuy(connection, coinData, privateKey, ids, solAmount, priorityFeeInSol, slippageDecimal);
            return { signature: signature };
        }
        //出售pump代币
        async pumpsellToken(params) {
            const { privateKey, ids, tokenAmount, priorityFeeInSol, slippageDecimal } = params;
            const paraminfo = { ids: ids };
            const coinData = await this.getPumpTokenInfo(paraminfo);
            const signature = await pumpUtils.pumpFunSell(connection, coinData, privateKey, ids, tokenAmount, priorityFeeInSol, slippageDecimal);
            return { signature: signature };
        }
    }
    return new sol_deal()
}
module.exports = initializeSolDeal;