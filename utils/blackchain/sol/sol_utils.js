const spl_token = require('@solana/spl-token')
const bs58 = require('bs58');
const { Keypair, PublicKey} = require('@solana/web3.js');
const { fetchWithRetry,parseTokenJson } = require('../../common/common')
const { Wallet } = require('@project-serum/anchor');
const { programs } = require("@metaplex/js");
const { freezeAccount } = require('@solana/spl-token');

/**
* 连接钱包
* @param {string} privateKey 私钥
* @returns {string} tokenMintAddress 代币地址
*/
async function connectWallt(privateKey) {
    try {
        const wallet = new Wallet(Keypair.fromSecretKey(bs58.decode(privateKey)));
        return wallet
    } catch (error) {
        return error;
    }
}
/**
 * 获取代币的精度
 * @param {Connection} connection 全节点JSON RPC端点的连接
 * @param {string} tokenMintAddress 代币地址
 * @returns {int} 代币精度
 */
async function getTokenMetadataDecimals(connection, tokenMintAddress) {
    try {
        const tokenMintAddressPublicKey = new PublicKey(tokenMintAddress);
        const res = await spl_token.getMint(connection, tokenMintAddressPublicKey, "confirmed")
        return res.decimals
    } catch (error) {
        console.error('获取精度失败:', error);
    }
}

/**
 * 获取代币供应量等相关信息
 * @param {Connection} connection 全节点JSON RPC端点的连接
 * @param {string} tokenMintAddress 代币地址
 * @returns {json} 代币
 */
async function getTokenMetadataInfo(connection, tokenMintAddress) {
    try {
        const tokenMintAddressPublicKey = new PublicKey(tokenMintAddress)
        const res = await spl_token.getMint(connection, tokenMintAddressPublicKey, "confirmed")
        const data = {
            address:res.address.toBase58(),
            mintAuthority: res.mintAuthority ? res.mintAuthority.toBase58() : null,
            supply: res.supply.toString(),
            decimals: res.decimals,
            isInitialized: res.isInitialized,
            freezeAccount:res.freezeAuthority ? res.freezeAuthority.toBase58() : null,
        }
        const tokenInfo = JSON.stringify(data)
        return tokenInfo
    } catch (error) {
        console.error('Error fetching token metadata:', error);
    }
}

/**
* 获取代币社交、官网等信息
* @param {Connection} connection 全节点JSON RPC端点的连接
* @param {string} tokenMintAddress 代币地址
* @returns {json} 社交信息
*/
async function getTokenMetadata(connection, tokenMintAddress) {
    try {
        const mintPublicKey = new PublicKey(tokenMintAddress);
        const metadataPDA = await programs.metadata.Metadata.getPDA(mintPublicKey);

        const tokenMetadata = await programs.metadata.Metadata.load(connection, metadataPDA);

        const metadata = {
            name: tokenMetadata.data.data.name,
            symbol: tokenMetadata.data.data.symbol,
            uri: tokenMetadata.data.data.uri,
        };
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: metadata.uri,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            // proxy: false,
            httpsAgent: new require('https').Agent({
                rejectUnauthorized: false  // 仅用于测试目的
            })
        };
        const response = await fetchWithRetry(config);
        // console.log("response: ", response.createdOn)
        const  socalInfo=await parseTokenJson(response)
        console.log("socalInfo",socalInfo)
        return socalInfo
    } catch (error) {
        console.log(error)
        throw error
    }
}

/**
* 获取发行代币的地址
* @param {json} TokenBalances 解析交易hash返回的postTokenBalnace中的json值
* @returns {string} tokenMintAddress 代币地址
*/
async function findUiTokenAccount(TokenBalances) {
    try {
        for (const balance of TokenBalances) {
            if (balance.mint.toString() != process.env.SOL_Token_Address) {
                return balance.mint;
            }
        }
        return null; // 如果没有找到匹配的对象，返回 null
    } catch (error) {
        return error
    }

}
/**
* 通过交易hash获取账户代币交易的余额
* @param {string} owner - 账户地址
* @param {string} mint  - 代币地址
* @param {json} TokenBalances 解析交易hash返回的postTokenBalnace中的json值
* @returns {json} uiTokenAmount 账户代币的余额
*/
async function findUiTokenAmount(owner, mint, TokenBalances) {
    for (const balance of TokenBalances) {
        if (balance.owner === owner && balance.mint === mint) {
            return balance.uiTokenAmount;
        }
    }
    return null; // 如果没有找到匹配的对象，返回 null
}
/**
* 获取账户交易的余额
* @param {Connection} connection 全节点JSON RPC端点的连接
* @param {string} accountAddress - 账户地址
* @param {string} tokenAddress  - 代币地址
* @returns {json} uiTokenAmount 账户代币的余额
*/
async function getTokenBalance(connection,accountAddress,tokenAddress) {
   
    const accountPublicKey = new PublicKey(accountAddress);
    const tokenMintAddress = new PublicKey(tokenAddress)
    try {
        // 获取账户余额信息
        const tokenAccount = await connection.getTokenAccountsByOwner(accountPublicKey, { mint: tokenMintAddress });
        let TokenBalance = await connection.getTokenAccountBalance(tokenAccount.value[0].pubkey)
        // 返回余额
        return TokenBalance;
    } catch (error) {
        console.error('Error fetching token balance:', error);
    }
}

module.exports = {
    getTokenMetadataDecimals,
    getTokenMetadataInfo,
    getTokenMetadata,
    findUiTokenAccount,
    connectWallt,
    getTokenBalance,
    findUiTokenAmount
}