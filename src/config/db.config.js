const mysql = require("mysql2/promise");
require("dotenv").config();

const { DB_IP, DB_NAME, DB_PWD, DB_USERNAME } = process.env;

const pool = mysql.createPool({
  host: DB_IP,
  user: DB_USERNAME,
  password: DB_PWD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
});

module.exports = { pool };
