const express = require('express');
const router = express.Router();
const pool = require('../db');


// ➜ GET tous les services
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


// ➜ POST créer un service
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;

    const result = await pool.query(
      'INSERT INTO services (title, description) VALUES ($1, $2) RETURNING *',
      [title, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


// ➜ DELETE supprimer un service
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM services WHERE id = $1', [id]);

    res.json({ message: 'Service supprimé' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;