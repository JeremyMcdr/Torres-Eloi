const XLSX = require('xlsx');
const path = require('path');

// Chemin vers le fichier XLS
const xlsFilePath = path.join(__dirname, '../../export_bdd_objectif_comm.xls');

// Fonction pour lire le fichier XLS
function readXlsFile() {
  try {
    console.log(`Tentative de lecture du fichier: ${xlsFilePath}`);
    
    // Lire le fichier XLS
    const workbook = XLSX.readFile(xlsFilePath);
    
    // Récupérer le nom de la première feuille
    const sheetName = workbook.SheetNames[0];
    console.log(`Nom de la feuille: ${sheetName}`);
    
    // Récupérer les données de la feuille
    const worksheet = workbook.Sheets[sheetName];
    
    // Convertir les données en JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet);
    console.log(`Nombre de lignes brutes: ${rawData.length}`);
    
    if (rawData.length > 0) {
      console.log('Exemple de première ligne:', JSON.stringify(rawData[0]));
      console.log('Noms des colonnes:', Object.keys(rawData[0]).join(', '));
    }
    
    // Normaliser les données pour s'assurer que les noms de colonnes sont corrects
    // et que toutes les valeurs sont du bon type
    const data = rawData.map((item, index) => {
      // Déterminer les noms de colonnes réels dans le fichier XLS
      const keys = Object.keys(item);
      
      // Trouver les colonnes correspondantes (peu importe la casse ou les espaces)
      // Utiliser des expressions régulières pour une correspondance plus flexible
      const idKey = keys.find(k => /id/i.test(k));
      const yearKey = keys.find(k => /annee|année|year|com_annee/i.test(k));
      const caKey = keys.find(k => /ca|chiffre|chiffre.*affaire/i.test(k));
      const objKey = keys.find(k => /obj|objectif|com_obj/i.test(k));
      
      // Si nous sommes à la première ligne ou à la dernière, afficher les clés trouvées
      if (index === 0 || index === rawData.length - 1) {
        console.log(`Ligne ${index} - Clés trouvées:`, { idKey, yearKey, caKey, objKey });
      }
      
      // Créer un objet normalisé avec les bonnes clés
      // Si nous ne trouvons pas certaines colonnes, utiliser les colonnes par position
      return {
        ID: idKey ? Number(item[idKey]) : (item['__EMPTY'] ? Number(item['__EMPTY']) : index + 1),
        COM_ANNEE: yearKey ? Number(item[yearKey]) : (item['__EMPTY_1'] ? Number(item['__EMPTY_1']) : null),
        CA: caKey ? Number(item[caKey]) : (item['__EMPTY_2'] ? Number(item['__EMPTY_2']) : 0),
        COM_OBJ: objKey ? Number(item[objKey]) : (item['__EMPTY_3'] ? Number(item['__EMPTY_3']) : 0)
      };
    });
    
    // Filtrer les lignes sans année (mais garder l'ID car il peut être généré)
    const validData = data.filter(item => item.COM_ANNEE !== null);
    
    console.log(`Nombre de lignes valides après filtrage: ${validData.length}`);
    if (validData.length > 0) {
      console.log('Exemple de première ligne normalisée:', JSON.stringify(validData[0]));
    }
    
    // Retourner les données normalisées
    return validData;
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier XLS:', error);
    throw error;
  }
}

// Fonction pour obtenir toutes les données
function getAllData() {
  return readXlsFile();
}

// Fonction pour obtenir les données agrégées par année
function getDataByYear() {
  const data = readXlsFile();
  
  // Créer un objet pour stocker les données agrégées par année
  const yearlyData = {};
  
  // Parcourir les données et les agréger par année
  data.forEach(item => {
    const year = item.COM_ANNEE;
    
    if (year && !yearlyData[year]) {
      yearlyData[year] = {
        COM_ANNEE: year,
        TotalCA: 0,
        TotalObjectif: 0
      };
    }
    
    if (year) {
      yearlyData[year].TotalCA += item.CA || 0;
      yearlyData[year].TotalObjectif += item.COM_OBJ || 0;
    }
  });
  
  // Convertir l'objet en tableau
  const result = Object.values(yearlyData);
  console.log(`Données agrégées par année: ${result.length} années trouvées`);
  return result;
}

// Fonction pour obtenir les données d'une année spécifique
function getDataForYear(year) {
  const data = readXlsFile();
  return data.filter(item => item.COM_ANNEE === parseInt(year));
}

// Fonction pour obtenir les statistiques globales
function getStats() {
  const data = readXlsFile();
  
  // Calculer les statistiques
  const stats = {
    TotalCA: 0,
    TotalObjectif: 0,
    MoyenneCA: 0,
    MaxCA: 0,
    MinCA: Number.MAX_SAFE_INTEGER
  };
  
  // Parcourir les données et calculer les statistiques
  data.forEach(item => {
    const ca = item.CA || 0;
    
    stats.TotalCA += ca;
    stats.TotalObjectif += item.COM_OBJ || 0;
    
    if (ca > stats.MaxCA) {
      stats.MaxCA = ca;
    }
    
    if (ca < stats.MinCA && ca > 0) {
      stats.MinCA = ca;
    }
  });
  
  // Calculer la moyenne
  stats.MoyenneCA = data.length > 0 ? stats.TotalCA / data.length : 0;
  
  // Si aucune valeur minimale n'a été trouvée, mettre à 0
  if (stats.MinCA === Number.MAX_SAFE_INTEGER) {
    stats.MinCA = 0;
  }
  
  console.log('Statistiques calculées:', stats);
  return stats;
}

module.exports = {
  getAllData,
  getDataByYear,
  getDataForYear,
  getStats
}; 