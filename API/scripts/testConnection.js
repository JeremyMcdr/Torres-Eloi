const { pool, poolConnect } = require('../config/db');

// Fonction pour tester la connexion
async function testConnection() {
  try {
    console.log('Tentative de connexion à SQL Server...');
    await poolConnect;
    console.log('Connexion à SQL Server établie avec succès!');
    
    // Tester une requête simple
    const result = await pool.request().query('SELECT @@VERSION AS Version');
    console.log('Version de SQL Server:', result.recordset[0].Version);
    
    // Fermer la connexion
    await pool.close();
    console.log('Connexion fermée');
  } catch (err) {
    console.error('Erreur lors du test de connexion:', err);
  }
}

// Exécuter le test
testConnection(); 