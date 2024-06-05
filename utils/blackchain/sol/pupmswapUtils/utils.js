const { ComputeBudgetProgram, Keypair, Connection, PublicKey, Transaction, TransactionInstruction, sendAndConfirmTransaction } = require('@solana/web3.js');
const bs58 = require('bs58');

/**
 * 从私钥字符串生成密钥对
 * @param {string} key - Base58 编码的私钥字符串
 * @returns {Promise<Keypair>} - 返回生成的密钥对
 */
async function getKeyPairFromPrivateKey(key) {
    return Keypair.fromSecretKey(
        new Uint8Array(bs58.decode(key))
    );
}

/**
 * 创建交易
 * @param {Connection} connection - Solana 区块链连接
 * @param {TransactionInstruction[]} instructions - 交易指令列表
 * @param {PublicKey} payer - 付款人的公钥
 * @param {number} [priorityFeeInSol=0] - 优先费用，以 SOL 为单位
 * @returns {Promise<Transaction>} - 返回生成的交易
 */
async function createTransaction(connection, instructions, payer, priorityFeeInSol = 0) {
    // 设置计算单元限制
    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units: 1400000,
    });

    const transaction = new Transaction().add(modifyComputeUnits);

    // 如果优先费用大于0，则设置计算单元价格
    if (priorityFeeInSol > 0) {
        const microLamports = priorityFeeInSol * 1_000_000_000; // 将 SOL 转换为 microLamports
        const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
            microLamports,
        });
        transaction.add(addPriorityFee);
    }

    transaction.add(...instructions);

    transaction.feePayer = payer;
    const BlockhashWithExpiryBlockHeight=await connection.getLatestBlockhash()
    transaction.recentBlockhash = BlockhashWithExpiryBlockHeight.blockhash
    transaction.lastValidBlockHeight=BlockhashWithExpiryBlockHeight.lastValidBlockHeight
    return transaction;
}

/**
 * 发送并确认交易
 * @param {Connection} connection - Solana 区块链连接
 * @param {Transaction} transaction - 要发送的交易
 * @param {Keypair[]} signers - 签名者的密钥对列表
 * @returns {Promise<string|null>} - 返回交易签名或 null
 */
async function sendAndConfirmTransactionWrapper(connection, transaction, signers) {
    try {
        const signature = await sendAndConfirmTransaction(connection, transaction, signers, { skipPreflight: true, preflightCommitment: 'confirmed' });
        console.log('Transaction confirmed with signature:', signature);
        return signature;
    } catch (error) {
        console.error('Error sending transaction:', error);
        return null;
    }
}

/**
 * 从 64 位整数值创建缓冲区
 * @param {number|string} value - 要转换的整数值
 * @returns {Buffer} - 返回包含该整数值的缓冲区
 */
function bufferFromUInt64(value) {
    let buffer = Buffer.alloc(8);
    buffer.writeBigUInt64LE(BigInt(value));
    return buffer;
}

module.exports = {
    getKeyPairFromPrivateKey,
    createTransaction,
    sendAndConfirmTransactionWrapper,
    bufferFromUInt64
};
