const mysql = require("mysql2");
const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.UNAMe,
  password: process.env.PASS,
  database: process.env.DB,
});

module.exports = db;
