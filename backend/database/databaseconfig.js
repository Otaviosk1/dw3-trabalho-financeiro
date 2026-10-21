const { Pool } = require('pg');

// Pool de conexoes com o PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Wrapper para execucao de queries
module.exports = {
  query: (text, params) => pool.query(text, params),
};