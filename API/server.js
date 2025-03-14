const express = require('express');
const cors = require('cors');
const kpiRoutes = require('./routes/kpiRoutes');
const { pool, poolConnect } = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/kpi', kpiRoutes);

// Route de base
app.get('/', (req, res) => {
  res.send('API KPI Dashboard est en ligne! (Mode SQL Server)');
});

// Gestion de la connexion à la base de données
poolConnect
  .then(() => {
    console.log('Connecté à SQL Server');
    
    // Démarrage du serveur une fois connecté à la base de données
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erreur de connexion à SQL Server:', err);
    console.log('Démarrage du serveur sans connexion à la base de données...');
    
    // Démarrer quand même le serveur pour pouvoir afficher l'erreur
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT} (sans connexion à la base de données)`);
    });
  }); 