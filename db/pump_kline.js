const DB = require('./db');

let dataTokenKlines = [];

//pump 代币价格数据批量插入
const insertTokenKlines = () => {
  if (dataTokenKlines.length === 0) return;
  const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const sql = `INSERT IGNORE INTO pump_kline (
      mint, timestamp, open, high, low, close, volume, slot,insert_time
    ) VALUES ?`;

  const values = dataTokenKlines.map(token_kline => [
    token_kline.mint,
    token_kline.timestamp,
    token_kline.open,
    token_kline.high,
    token_kline.low,
    token_kline.close,
    token_kline.volume,
    token_kline.slot,
    currentTime
  ]);

  DB.pool.query(sql, [values], (err, results) => {
    if (err) {
      console.error('Error inserting token_klines:', err);
    } else {
      console.log('token_klines inserted successfully');
      dataTokenKlines=[]
    }
  });
};
const PushTokenKlines = (newData) => {
  dataTokenKlines.push(newData);
  if (dataTokenKlines.length >= 50) {
    console.log('k数据长度超过50,开始插入');
    insertTokenKlines();
  }
};

module.exports = {
  PushTokenKlines,
  insertTokenKlines,
};