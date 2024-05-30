const bs58 = require("bs58");
const { Transaction, VersionedTransaction } = require("@solana/web3.js");

async function getSignature(transaction) {
    const signature =
        transaction instanceof Transaction
            ? transaction.signature
            : transaction.signatures[0];
    if (!signature) {
        throw new Error(
            "Missing transaction signature, the transaction was not signed by the fee payer"
        );
    }
    return bs58.encode(signature);
}

module.exports =  getSignature

