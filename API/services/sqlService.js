const { pool, sql } = require('../config/db');

// Fonction pour obtenir toutes les données
async function getAllData() {
  try {
    await pool.connect();
    const result = await pool.request().query(`
      SELECT 
        ID,
        COM_ANNEE,
        CA,
        COM_OBJ,
        COM_NOM
      FROM 
        Commerciaux
    `);
    
    console.log(`Nombre de lignes récupérées: ${result.recordset.length}`);
    return result.recordset;
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    throw error;
  }
}

// Fonction pour obtenir les données agrégées par année
async function getDataByYear() {
  try {
    await pool.connect();
    const result = await pool.request().query(`
      SELECT 
        COM_ANNEE,
        SUM(CA) AS TotalCA,
        SUM(COM_OBJ) AS TotalObjectif
      FROM 
        Commerciaux
      WHERE 
        COM_ANNEE IS NOT NULL
      GROUP BY 
        COM_ANNEE
      ORDER BY 
        COM_ANNEE
    `);
    
    console.log(`Données agrégées par année: ${result.recordset.length} années trouvées`);
    return result.recordset;
  } catch (error) {
    console.error('Erreur lors de la récupération des données par année:', error);
    throw error;
  }
}

// Fonction pour obtenir les données d'une année spécifique
async function getDataForYear(year) {
  try {
    await pool.connect();
    const result = await pool.request()
      .input('year', sql.Int, parseInt(year))
      .query(`
        SELECT 
          ID,
          COM_ANNEE,
          CA,
          COM_OBJ,
          COM_NOM
        FROM 
          Commerciaux
        WHERE 
          COM_ANNEE = @year
      `);
    
    console.log(`Données pour l'année ${year}: ${result.recordset.length} lignes trouvées`);
    return result.recordset;
  } catch (error) {
    console.error(`Erreur lors de la récupération des données pour l'année ${year}:`, error);
    throw error;
  }
}

// Fonction pour obtenir les statistiques globales
async function getStats() {
  try {
    await pool.connect();
    const result = await pool.request().query(`
      SELECT 
        SUM(CA) AS TotalCA,
        SUM(COM_OBJ) AS TotalObjectif,
        AVG(CA) AS MoyenneCA,
        MAX(CA) AS MaxCA,
        MIN(CASE WHEN CA > 0 THEN CA ELSE NULL END) AS MinCA
      FROM 
        Commerciaux
    `);
    
    // Vérifier si nous avons des résultats
    if (result.recordset.length > 0) {
      const stats = result.recordset[0];
      
      // Convertir les valeurs NULL en 0
      Object.keys(stats).forEach(key => {
        if (stats[key] === null) {
          stats[key] = 0;
        }
      });
      
      console.log('Statistiques calculées:', stats);
      return stats;
    } else {
      // Retourner des statistiques par défaut si aucun résultat
      return {
        TotalCA: 0,
        TotalObjectif: 0,
        MoyenneCA: 0,
        MaxCA: 0,
        MinCA: 0
      };
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    throw error;
  }
}

// Fonction pour obtenir les données de temps de validation
async function getValidationTimeData() {
  try {
    await pool.connect();
    const result = await pool.request().query(`
      SELECT 
        c.ID,
        c.COM_ANNEE,
        c.COM_NOM,
        AVG(v.TEMPS_VALIDATION) AS TempsValidationMoyen,
        COUNT(v.ID) AS NombreCommandes
      FROM 
        Commerciaux c
      JOIN 
        ValidationCommandes v ON c.ID = v.ID_COMMERCIAL
      WHERE 
        c.COM_ANNEE IS NOT NULL
      GROUP BY 
        c.ID, c.COM_ANNEE, c.COM_NOM
      ORDER BY 
        c.COM_ANNEE, c.ID
    `);
    
    console.log(`Données de temps de validation: ${result.recordset.length} lignes trouvées`);
    return result.recordset;
  } catch (error) {
    console.error('Erreur lors de la récupération des données de temps de validation:', error);
    throw error;
  }
}

module.exports = {
  getAllData,
  getDataByYear,
  getDataForYear,
  getStats,
  getValidationTimeData
}; 