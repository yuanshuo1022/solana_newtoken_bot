const DB = require('./db');

//pump新发行代币 插入数据库
let dataBatch = [];
const InsertPumpNewTokenData = () => {
    if (dataBatch.length === 0) return;
    // 获取当前时间并格式化为 MySQL 的时间格式
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = `INSERT IGNORE INTO pump_newtokens (
    mint, token_name, symbol, description, image_uri, metadata_uri, twitter, telegram, bonding_curve, 
    associated_bonding_curve, creator, created_timestamp, raydium_pool, complete, virtual_sol_reserves, 
    virtual_token_reserves, total_supply, website, show_name, king_of_the_hill_timestamp, market_cap, 
    nsfw, market_id, inverted, usd_market_cap, insert_time
  ) VALUES ?`;

    const values = dataBatch.map(d => [
        d.mint, d.name, d.symbol, d.description, d.image_uri, d.metadata_uri,
        d.twitter, d.telegram, d.bonding_curve, d.associated_bonding_curve, d.creator,
        d.created_timestamp, d.raydium_pool, d.complete, d.virtual_sol_reserves,
        d.virtual_token_reserves, d.total_supply, d.website, d.show_name,
        d.king_of_the_hill_timestamp, d.market_cap, d.nsfw, d.market_id, d.inverted,
        d.usd_market_cap, currentTime
    ]);

    DB.pool.query(sql, [values], (err, results) => {
        if (err) console.error('Error inserting batch:', err);
        else console.log('Batch inserted successfully');
        dataBatch = [];
    });
};

const PushPumpNewTokenData = (newData) => {
    dataBatch.push(newData);
    if (dataBatch.length >= 50) {
        console.log('数据长度超过50,开始插入');
        InsertPumpNewTokenData();
    }
};

module.exports = {
    PushPumpNewTokenData,
    InsertPumpNewTokenData,
};