const express = require('express');
const cors = require('cors');
const kpiRoutes = require('./routes/kpiRoutes');
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
  res.send('API KPI Dashboard est en ligne! (Mode fichier XLS)');
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 