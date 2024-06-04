const mysql = require('mysql');
const { DB_host, DB_user, DB_password, DB_database, DB_port } = require('../config/config');

const pool = mysql.createPool({
  connectionLimit: 16,
  host: DB_host,
  user: DB_user,
  port: DB_port,
  password: DB_password,
  database: DB_database,
  charset: 'utf8mb4',
  autoReconnect: true, // 启用自动重连
  reconnectInterval: 5000 // 重连间隔
});

pool.on('error', (err) => {
  console.error('Database error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Attempting to reconnect...');
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Failed to reconnect:', err);
      } else {
        console.log('Successfully reconnected!');
        connection.release();
      }
    });
  } else {
    console.error('Unknown error:', err);
  }
});


module.exports = {
  pool
};