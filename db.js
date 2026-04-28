const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'bookstore'
});

module.exports = db;
