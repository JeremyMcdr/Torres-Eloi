const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function connectToDatabase() {
  try {
    const pool = await sql.connect(config);
    console.log('Connecté à SQL Server');
    return pool;
  } catch (err) {
    console.error('Erreur de connexion à SQL Server:', err);
    throw err;
  }
}

module.exports = {
  connectToDatabase,
  sql
}; 