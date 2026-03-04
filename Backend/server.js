// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const pool = require('./db');

// Import des routes
const servicesRoutes = require('./routes/services');
const activitiesRoutes = require('./routes/activities');
const imagesRoutes = require('./routes/images');
const contactsRoutes = require('./routes/contacts');
const adminsRoutes = require('./routes/admins');
// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/admins', adminsRoutes);
// Routes racine et test DB
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

// Routes API
app.use('/api/services', servicesRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/images', imagesRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/admins', adminsRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});