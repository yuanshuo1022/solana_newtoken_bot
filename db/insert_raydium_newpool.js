const DB = require('./db');

//Raydium新池子 插入数据库
let dataRaydiumBatch = [];
const InsertRaydiumNewPoolData = () => {
    if (dataRaydiumBatch.length === 0) return;
    // 获取当前时间并格式化为 MySQL 的时间格式
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = `INSERT IGNORE INTO raydium_newpool (
        token_address, 
        lp_address, 
        pool_amount, 
        pool_actual_supply, 
        pool_open_time, 
        supply, 
        decimals, 
        is_mint, 
        is_freeze, 
        burn_pct, 
        burn_amount, 
        twitter, 
        telegram, 
        discord, 
        website, 
        is_pump, 
        insert_time
    ) VALUES ?`;

    const values = dataRaydiumBatch.map(d => [
        d.token_address,
        d.lp_address,
        d.pool_amount,
        d.pool_actual_supply,
        d.pool_open_time,
        d.supply,
        d.decimals,
        d.is_mint,
        d.is_freeze,
        d.burn_pct,
        d.burn_amount,
        d.twitter,
        d.telegram,
        d.discord,
        d.website,
        d.is_pump,
        currentTime
    ]);


    DB.pool.query(sql, [values], (err, results) => {
        if (err) console.error('Error inserting batch:', err);
        else console.log('Batch inserted successfully');
        dataRaydiumBatch = [];
    });
};

const PushRaydiumNewPoolData = (newData) => {
    dataRaydiumBatch.push(newData);
    if (dataRaydiumBatch.length >= 2) {
        console.log('数据长度超过2,开始插入');
        InsertRaydiumNewPoolData();
    }
};

module.exports = {
    PushRaydiumNewPoolData,
    InsertRaydiumNewPoolData,
};