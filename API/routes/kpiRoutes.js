const express = require('express');
const router = express.Router();
const sqlService = require('../services/sqlService');

// Route pour obtenir toutes les données KPI
router.get('/data', async (req, res) => {
  try {
    const data = await sqlService.getAllData();
    res.json(data);
  } catch (err) {
    console.error('Erreur lors de la récupération des données:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour obtenir les données par année
router.get('/data/by-year', async (req, res) => {
  try {
    const data = await sqlService.getDataByYear();
    res.json(data);
  } catch (err) {
    console.error('Erreur lors de la récupération des données par année:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour obtenir les données d'une année spécifique
router.get('/data/year/:year', async (req, res) => {
  try {
    const { year } = req.params;
    const data = await sqlService.getDataForYear(year);
    res.json(data);
  } catch (err) {
    console.error('Erreur lors de la récupération des données pour l\'année:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour obtenir les statistiques globales
router.get('/stats', async (req, res) => {
  try {
    const stats = await sqlService.getStats();
    res.json(stats);
  } catch (err) {
    console.error('Erreur lors de la récupération des statistiques:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour obtenir les données de temps de validation
router.get('/validation-time', async (req, res) => {
  try {
    const data = await sqlService.getValidationTimeData();
    res.json(data);
  } catch (err) {
    console.error('Erreur lors de la récupération des données de temps de validation:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router; 