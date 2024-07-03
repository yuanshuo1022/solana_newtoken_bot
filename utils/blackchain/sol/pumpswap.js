const {
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    Transaction,
    TransactionInstruction,
} = require('@solana/web3.js');
const {
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    TOKEN_PROGRAM_ID
} = require('@solana/spl-token');
const { getKeyPairFromPrivateKey, createTransaction, sendAndConfirmTransactionWrapper, bufferFromUInt64 } = require('./pupmswapUtils/utils');
const {
    GLOBAL,
    FEE_RECIPIENT,
    SYSTEM_PROGRAM_ID,
    RENT,
    PUMP_FUN_ACCOUNT,
    PUMP_FUN_PROGRAM,
    ASSOC_TOKEN_ACC_PROG
} = require('./pupmswapUtils/constants');
const SolUtils = require('./sol_utils')
const getSignature = require('./getSignature')
const transactionSenderAndConfirmationWaiter = require("./transactionSender")

/**
 * 购买交易函数
 * @param {string} payerPrivateKey - 付款人的私钥
 * @param {string} mintStr - 代币的 mint 地址
 * @param {number} solIn - 输入的 SOL 数量
 * @param {number} [priorityFeeInSol=0] - 优先费用（可选）
 * @param {number} [slippageDecimal=0.25] - 滑点百分比（可选）
 */
// const ENDPOINT_SOL = JSON.parse(process.env.ENDPOINT_SOL) //PRC

async function pumpFunBuy(connection, coinData, payerPrivateKey, mintStr, solIn, priorityFeeInSol = 0, slippageDecimal = 0.25) {
    try {
        // 创建与 Solana 主网的连接
        // const connection = new Connection(clusterApiUrl("mainnet-beta"), 'confirmed');
        // // 获取代币数据
        // const coinData = await getCoinData(mintStr);
        // if (!coinData) {
        //     console.error('Failed to retrieve coin data...');
        //     return;
        // }

        // 从私钥获取付款人的密钥对
        const payer = await getKeyPairFromPrivateKey(payerPrivateKey);
        console.log("payer: ", payer)
        const owner = payer.publicKey;
        const mint = new PublicKey(mintStr);

        const txBuilder = new Transaction();

        // 获取关联的代币账户地址
        const tokenAccountAddress = await getAssociatedTokenAddress(mint, owner, false);

        // 检查关联的代币账户是否存在
        const tokenAccountInfo = await connection.getAccountInfo(tokenAccountAddress);
        let tokenAccount;
        if (!tokenAccountInfo) {
            // 如果不存在，则创建关联的代币账户
            txBuilder.add(
                createAssociatedTokenAccountInstruction(
                    payer.publicKey,
                    tokenAccountAddress,
                    payer.publicKey,
                    mint
                )
            );
            tokenAccount = tokenAccountAddress;
        } else {
            tokenAccount = tokenAccountAddress;
        }

        // 计算输入的 SOL 数量（以 lamports 为单位）和预期的输出代币数量
        const solInLamports = solIn * LAMPORTS_PER_SOL;
        const tokenOut = Math.floor(solInLamports * coinData["virtual_token_reserves"] / coinData["virtual_sol_reserves"]);

        // 计算包含滑点的最大 SOL 成本
        const solInWithSlippage = solIn * (1 + slippageDecimal);
        const maxSolCost = Math.floor(solInWithSlippage * LAMPORTS_PER_SOL);

        const keys = [
            { pubkey: GLOBAL, isSigner: false, isWritable: false },
            { pubkey: FEE_RECIPIENT, isSigner: false, isWritable: true },
            { pubkey: mint, isSigner: false, isWritable: false },
            { pubkey: new PublicKey(coinData['bonding_curve']), isSigner: false, isWritable: true },
            { pubkey: new PublicKey(coinData['associated_bonding_curve']), isSigner: false, isWritable: true },
            { pubkey: tokenAccount, isSigner: false, isWritable: true },
            { pubkey: owner, isSigner: false, isWritable: true },
            { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: RENT, isSigner: false, isWritable: false },
            { pubkey: PUMP_FUN_ACCOUNT, isSigner: false, isWritable: false },
            { pubkey: PUMP_FUN_PROGRAM, isSigner: false, isWritable: false }
        ];

        // 创建交易指令数据
        const data = Buffer.concat([
            bufferFromUInt64("16927863322537952870"),  // 指令标识符
            bufferFromUInt64(tokenOut),                 // 预期的输出代币数量
            bufferFromUInt64(maxSolCost)                // 最大 SOL 成本
        ]);

        const instruction = new TransactionInstruction({
            keys: keys,
            programId: PUMP_FUN_PROGRAM,
            data: data
        });
        txBuilder.add(instruction);

        // 创建并发送交易
        const transaction = await createTransaction(connection, txBuilder.instructions, payer.publicKey, priorityFeeInSol);
        //序列化参数
        //  const swapTransactionBuf = Buffer.from(transactionbuy, 'base64');
        //  var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
        const blockhash = transaction?.recentBlockhash;
        //签名交易 sign the transaction
        transaction.sign(payer);
        console.log("transaction", transaction)

        const signatrue = await getSignature(transaction)
        console.log("signatrue", signatrue)
        //验证交易是否合法
        const { value: simulatedTransactionResponse } = await connection.simulateTransaction(transaction)
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
            lastValidBlockHeight: transaction?.lastValidBlockHeight,
        }
        const serializedTransaction = Buffer.from(rawTransaction);
        //提交执行交易
        console.log('开始confirmTransaction：');
        const txid = await transactionSenderAndConfirmationWaiter({ connection, serializedTransaction, blockhashWithExpiryBlockHeight });
        if (txid) {
            const postTokenBlance = await SolUtils.findUiTokenAmount(payer.publicKey.toString(), mintStr, txSwap.meta.postTokenBalances)
            const preTokenBalnace = await SolUtils.findUiTokenAmount(payer.publicKey.toString(), mintStr, txSwap.meta.preTokenBalances)
            const postBalance = txSwap.meta.postBalances[0]
            const preBlance = txSwap.meta.preBalances[0]
            const solAmount = postBalance - preBlance
            const tokenAmount = postTokenBlance.uiAmount - preTokenBalnace.uiAmount
            const res = {
                url: 'https://solscan.io/tx/' + signatrue,
                transactionHash: signatrue, //交易hash
                gasfee: txid.meta.fee,
                postTokenBlance: postTokenBlance,
                preTokenBalnace: preTokenBalnace,
                solAmount: solAmount / LAMPORTS_PER_SOL,
                tokenAmount: tokenAmount,
                txid: txid,
                err: txSwap.meta.err
            }
            return res
        }
        const res = {
            err: "sell fail"
        }
        return res
    } catch (error) {
        console.log(error);
    }
}

/**
 * 出售交易函数
 * @param {string} payerPrivateKey - 付款人的私钥
 * @param {string} mintStr - 代币的 mint 地址
 * @param {number} tokenBalance - 输入的代币余额
 * @param {number} [priorityFeeInSol=0] - 优先费用（可选）
 * @param {number} [slippageDecimal=0.25] - 滑点百分比（可选）
 */
async function pumpFunSell(connection, coinData, payerPrivateKey, mintStr, tokenBalance, priorityFeeInSol = 0, slippageDecimal = 0.25) {
    try {

        // 从私钥获取付款人的密钥对
        const payer = await getKeyPairFromPrivateKey(payerPrivateKey);
        const owner = payer.publicKey;
        const mint = new PublicKey(mintStr);
        const txBuilder = new Transaction();

        // 获取关联的代币账户地址
        const tokenAccountAddress = await getAssociatedTokenAddress(mint, owner, false);

        // 检查关联的代币账户是否存在
        const tokenAccountInfo = await connection.getAccountInfo(tokenAccountAddress);
        let tokenAccount;
        if (!tokenAccountInfo) {
            // 如果不存在，则创建关联的代币账户
            txBuilder.add(
                createAssociatedTokenAccountInstruction(
                    payer.publicKey,
                    tokenAccountAddress,
                    payer.publicKey,
                    mint
                )
            );
            tokenAccount = tokenAccountAddress;
        } else {
            tokenAccount = tokenAccountAddress;
        }
        const tokenDecimals= SolUtils.getTokenMetadataDecimals(connection,mintStr)
        const tokenAmount=tokenBalance*Math.pow(10,tokenDecimals)
        // 计算包含滑点的最小 SOL 输出
        const minSolOutput = Math.floor(tokenAmount * (1 - slippageDecimal) * coinData["virtual_sol_reserves"] / coinData["virtual_token_reserves"]);

        const keys = [
            { pubkey: GLOBAL, isSigner: false, isWritable: false },
            { pubkey: FEE_RECIPIENT, isSigner: false, isWritable: true },
            { pubkey: mint, isSigner: false, isWritable: false },
            { pubkey: new PublicKey(coinData['bonding_curve']), isSigner: false, isWritable: true },
            { pubkey: new PublicKey(coinData['associated_bonding_curve']), isSigner: false, isWritable: true },
            { pubkey: tokenAccount, isSigner: false, isWritable: true },
            { pubkey: owner, isSigner: false, isWritable: true },
            { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: ASSOC_TOKEN_ACC_PROG, isSigner: false, isWritable: false },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: PUMP_FUN_ACCOUNT, isSigner: false, isWritable: false },
            { pubkey: PUMP_FUN_PROGRAM, isSigner: false, isWritable: false }
        ];

        // 创建交易指令数据
        const data = Buffer.concat([
            bufferFromUInt64("12502976635542562355"),  // 指令标识符
            bufferFromUInt64(tokenAmount),            // 输入的代币数量
            bufferFromUInt64(minSolOutput)             // 最小 SOL 输出
        ]);

        const instruction = new TransactionInstruction({
            keys: keys,
            programId: PUMP_FUN_PROGRAM,
            data: data
        });
        txBuilder.add(instruction);

        // 创建并发送交易
        const transaction = await createTransaction(connection, txBuilder.instructions, payer.publicKey, priorityFeeInSol);
        //序列化参数
        //  const swapTransactionBuf = Buffer.from(transactionbuy, 'base64');
        //  var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
        const blockhash = transaction?.recentBlockhash;
        //签名交易 sign the transaction
        transaction.sign(payer);
        console.log("transaction", transaction)

        const signatrue = await getSignature(transaction)
        console.log("signatrue", signatrue)
        //验证交易是否合法
        const { value: simulatedTransactionResponse } = await connection.simulateTransaction(transaction)
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
            lastValidBlockHeight: transaction?.lastValidBlockHeight,
        }
        const serializedTransaction = Buffer.from(rawTransaction);
        //提交执行交易
        console.log('开始confirmTransaction：');
        const txid = await transactionSenderAndConfirmationWaiter({ connection, serializedTransaction, blockhashWithExpiryBlockHeight });
        console.log("txid", txid)

        if (txid) {
            const postTokenBlance = await SolUtils.findUiTokenAmount(payer.publicKey.toString(), mintStr, txSwap.meta.postTokenBalances)
            const preTokenBalnace = await SolUtils.findUiTokenAmount(payer.publicKey.toString(), mintStr, txSwap.meta.preTokenBalances)
            const postBalance = txSwap.meta.postBalances[0]
            const preBlance = txSwap.meta.preBalances[0]
            const solAmount = postBalance - preBlance
            const tokenAmount = postTokenBlance.uiAmount - preTokenBalnace.uiAmount
            const res = {
                url: 'https://solscan.io/tx/' + signatrue,
                transactionHash: signatrue, //交易hash
                gasfee: txid.meta.fee,
                postTokenBlance: postTokenBlance,
                preTokenBalnace: preTokenBalnace,
                solAmount: solAmount / LAMPORTS_PER_SOL,
                tokenAmount: tokenAmount,
                txid: txid,
                err: txSwap.meta.err
            }
            return res
        }
        const res = {
            err: "sell fail"
        }
        return res

    } catch (error) {
        console.log(error);
    }
}
module.exports = { pumpFunBuy, pumpFunSell }