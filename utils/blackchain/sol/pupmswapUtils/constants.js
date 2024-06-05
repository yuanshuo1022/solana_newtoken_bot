const { PublicKey, SystemProgram } = require('@solana/web3.js');

// 定义常量，使用 PublicKey 创建新的公钥对象
const GLOBAL = new PublicKey("4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf");
const FEE_RECIPIENT = new PublicKey("CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM");
const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const ASSOC_TOKEN_ACC_PROG = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
const RENT = new PublicKey("SysvarRent111111111111111111111111111111111");
const PUMP_FUN_PROGRAM = new PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P");
const PUMP_FUN_ACCOUNT = new PublicKey("Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1");
const SYSTEM_PROGRAM_ID = SystemProgram.programId;

module.exports = {
    GLOBAL,
    FEE_RECIPIENT,
    TOKEN_PROGRAM_ID,
    ASSOC_TOKEN_ACC_PROG,
    RENT,
    PUMP_FUN_PROGRAM,
    PUMP_FUN_ACCOUNT,
    SYSTEM_PROGRAM_ID
};
