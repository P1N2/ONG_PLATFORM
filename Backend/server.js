// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const pool = require('./db');
const servicesRoutes = require('./routes/services');
// Middleware
app.use(cors());
app.use(express.json());

// Route test
app.get('/', (req, res) => {
    res.send('Backend ONG fonctionne');
});
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur connexion base de données');
  }
});
app.use('/api/services', servicesRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});