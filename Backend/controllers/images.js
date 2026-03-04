const pool = require('../db');

// Ajouter image à une activité
exports.add = async (req, res) => {
  try {
    const { activity_id, image_url } = req.body;
    const result = await pool.query(
      'INSERT INTO activity_images (activity_id, image_url) VALUES ($1, $2) RETURNING *',
      [activity_id, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// GET images d’une activité
exports.getByActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const result = await pool.query(
      'SELECT * FROM activity_images WHERE activity_id = $1',
      [activityId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};