const DB = require('./db');

//获取铸币时间戳和铸币量 ---测试
const getMintAndTimestamp = () => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT mint, created_timestamp FROM pump_newtokens ORDER BY created_timestamp ASC LIMIT 50`;
  
      DB.pool.query(sql, (err, results) => {
        if (err) {
          return reject(err);
        }
  
        const data = results.map(row => ({
          mint: row.mint,
          created_timestamp: row.created_timestamp
        }));
  
        resolve(data);
      });
    });
  };

  const insertPriceData = (data) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO price_data (mint, start_price, end_price, price_change,time_diff) VALUES ?`;
      const values = data.map(item => [item.mint, item.start_price, item.end_price, item.price_change,item.time_diff]);
  
      DB.pool.query(sql, [values], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  };
  

  module.exports = { getMintAndTimestamp,insertPriceData };