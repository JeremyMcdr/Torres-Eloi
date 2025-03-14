const express = require('express');
const router = express.Router();
const xlsService = require('../services/xlsService');

// Route pour obtenir toutes les données KPI
router.get('/data', (req, res) => {
  try {
    const data = xlsService.getAllData();
    res.json(data);
  } catch (err) {
    console.error('Erreur lors de la récupération des données:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour obtenir les données par année
router.get('/data/by-year', (req, res) => {
  try {
    const data = xlsService.getDataByYear();
    res.json(data);
  } catch (err) {
    console.error('Erreur lors de la récupération des données par année:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour obtenir les données d'une année spécifique
router.get('/data/year/:year', (req, res) => {
  try {
    const { year } = req.params;
    const data = xlsService.getDataForYear(year);
    res.json(data);
  } catch (err) {
    console.error('Erreur lors de la récupération des données pour l\'année:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour obtenir les statistiques globales
router.get('/stats', (req, res) => {
  try {
    const stats = xlsService.getStats();
    res.json(stats);
  } catch (err) {
    console.error('Erreur lors de la récupération des statistiques:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router; 