const pool = require('../db');

// Envoyer message (public)
exports.create = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const result = await pool.query(
      'INSERT INTO contacts (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, subject, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


// Voir tous les messages (admin, sans token)
exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// UPDATE message (admin)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, subject, message } = req.body;

    const result = await pool.query(
      'UPDATE contacts SET name = $1, email = $2, subject = $3, message = $4 WHERE id = $5 RETURNING *',
      [name, email, subject ?? null, message, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Message introuvable' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// DELETE message (admin)
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM contacts WHERE id = $1', [id]);
    res.json({ message: 'Message supprimé' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};