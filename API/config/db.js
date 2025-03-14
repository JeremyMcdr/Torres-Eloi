const sql = require('mssql');
require('dotenv').config();

// Configuration de la connexion SQL Server
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false, // Pour les connexions locales, généralement false
    trustServerCertificate: true, // Pour les environnements de développement
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Création d'un pool de connexions
const pool = new sql.ConnectionPool(dbConfig);
const poolConnect = pool.connect();

// Gestion des erreurs de connexion
poolConnect.catch(err => {
  console.error('Erreur de connexion à SQL Server:', err);
});

module.exports = {
  sql,
  pool,
  poolConnect
}; 