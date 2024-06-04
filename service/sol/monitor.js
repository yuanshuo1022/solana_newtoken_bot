const { LIQUIDITY_STATE_LAYOUT_V4, MARKET_STATE_LAYOUT_V3, Token, TokenAmount } = require('@raydium-io/raydium-sdk');
const dotenv = require('dotenv');
const ConnectRPC = require('./connect');
const SolUtils = require('../../utils/blackchain/sol/sol_utils');
const CommonUtils = require('../../utils/common/common');
const initializeSolDeal = require('./deal')
const { PushPumpNewTokenData } = require('../../db/insert_pump_token')
const { PushTokenKlines } = require("../../db/pump_kline")
const { PushRaydiumNewPoolData } = require("../../db/insert_raydium_newpool")
const { getMintAndTimestamp, insertPriceData } = require("../../db/test_mint_increase")
const { PublicKey } = require('@solana/web3.js');
dotenv.config();
const SOL_PUMP_PUBLIC_KEY = process.env.SOL_PUMP_PUBLIC_KEY //PUMP
const ENDPOINT_SOL = JSON.parse(process.env.ENDPOINT_SOL) //PRC
const SOL_RAYDIUM_PUBLIC_KEY = process.env.SOL_RAYDIUM_PUBLIC_KEY //RAYDIUM
const SOL_Token_Address = process.env.SOL_Token_Address
const INSTRUCTION_NAME = "initialize2";
async function initMonitor() {
    const connection = await ConnectRPC.connection(ENDPOINT_SOL);
    // 初始化 sol_deal 实例
    const solDealInstance = await initializeSolDeal();
    let lastSignature = null;
    let lastRaydiumPool = null;
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
                // console.log(info)
                //获取代币价格K线
                const infoKline = await solDealInstance.getPumpPrice(params)
                // console.log(infoKline)
                //TODO ws或者队列操作

                //数据库操作(批量插入)
                await PushPumpNewTokenData(info);
                await infoKline.forEach(data => PushTokenKlines(data));
                return info
            } catch (error) {
                return error
            }


        }
       
        //监听raydium上加入流动性的代币池
        async monitor_raydium_newpool() {
            console.log("监听raydium新池子")
            connection.onLogs(
                new PublicKey(SOL_RAYDIUM_PUBLIC_KEY),
                async ({ logs, err, signature }) => {
                    if (err) return;
                    if (logs && logs.some(log => log.includes(INSTRUCTION_NAME))) {
                       if (lastRaydiumPool==signature){
                        return 
                       }
                       lastRaydiumPool=signature
                        console.log("Signature来自'initialize2':", `${signature}`);
                       await this.fetchRaydiumMints(signature);
                    }
                },
                "finalized"
            );
        }
        async fetchRaydiumMints(txId) {
            try {
                const tx = await connection.getParsedTransaction(
                    txId,
                    {
                        maxSupportedTransactionVersion: 0,
                        commitment: 'confirmed'
                    });

                const instructions = tx.transaction.message.instructions;
                const accounts = instructions.find(ix => ix.programId.toBase58() === SOL_RAYDIUM_PUBLIC_KEY).accounts;
                if (!accounts) {
                    console.log("No accounts found in the transaction.");
                    return;
                }
                const tokenAIndex = 8;
                const tokenBIndex = 9;
                const tokenPoolIndex = 4;
                const tokenAAccount = accounts[tokenAIndex];
                const tokenBAccount = accounts[tokenBIndex];
                const tokenPoolAccount = accounts[tokenPoolIndex];
                const tokenPoolccountArray = new PublicKey(tokenPoolAccount.toBase58())
                const Poolaccount = await connection.getAccountInfo(tokenPoolccountArray)
                const poolState = LIQUIDITY_STATE_LAYOUT_V4.decode(Poolaccount.data)
                const poolOpenTime = parseInt(poolState.poolOpenTime.toString());
                const displayData = [
                    { "Token": "A", "Account Public Key": tokenAAccount.toBase58() },
                    { "Token": "B", "Account Public Key": tokenBAccount.toBase58() }
                ];
                console.table(displayData);
                //获取代币信息
                let tokenMintAddress = await CommonUtils.isEquals(tokenAAccount.toBase58(), SOL_Token_Address, new PublicKey(tokenBAccount.toBase58()), new PublicKey(tokenAAccount.toBase58()))
                const poolBalance = await connection.getTokenAccountBalance(poolState.quoteVault, connection.commitment)
                const info = await SolUtils.getTokenMetadataInfo(connection, tokenMintAddress)
                console.log(info)
                // await SolUtils.getTokenMetadata(connection,tokenMintAddress)
                const tokenInfo = JSON.parse(info)
                const data = {
                    tokenAddress: tokenMintAddress,
                    supply: tokenInfo.supply,
                    decimals: tokenInfo.decimals,
                    poolOpenTime: poolOpenTime,
                    poolBalance: poolBalance.value.uiAmount
                }
                //ws或队列处理
                // const jsonString = JSON.stringify(data);
                // WssInstance.sendMessage(jsonString)
                //数据库处理
                let token_address = await CommonUtils.isEquals(tokenAAccount.toBase58(), SOL_Token_Address, tokenBAccount.toBase58(), tokenAAccount.toBase58())
                const insert_info = {
                    token_address: token_address,
                    pool_amount: data.poolBalance,
                    pool_open_time: poolOpenTime,
                    supply: data.supply,
                    decimals: data.decimals
                }
                await PushRaydiumNewPoolData(insert_info)

            } catch (error) {
                console.log(error)
                console.log("Error fetching transaction:", txId);
                return;
            }
        }


        //判断代币数据涨幅
        async test_increase() {
            try {
                const mintAddresses = await getMintAndTimestamp();
                let priceDataArray = [];

                for (let mint of mintAddresses) {
                    const params = { ids: mint.mint };
                    const infoKline = await solDealInstance.getPumpPrice(params);
                    new Promise(resolve => setTimeout(resolve, 500));
                    if (infoKline.length > 0) {
                        const startPrice = infoKline[0].close;
                        const endPrice = infoKline[infoKline.length - 1].close;
                        const priceChange = ((endPrice - startPrice) / startPrice) * 100;
                        const time_diff = (infoKline[infoKline.length - 1].timestamp - infoKline[0].timestamp) / 60 + 5;
                        priceDataArray.push({
                            mint: mint.mint,
                            start_price: startPrice,
                            end_price: endPrice,
                            price_change: priceChange,
                            time_diff: time_diff
                        });
                        if (priceDataArray.length >= 2) {
                            await insertPriceData(priceDataArray);
                            priceDataArray = [];
                            console.log('Price data inserted successfully');
                        }
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

    }
    return new sol_monitor()
}
module.exports = initMonitor;
