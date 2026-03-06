const pool = require('../db');

// GET toutes les activités (sans images)
exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM activities ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// GET toutes les activités avec leurs images
exports.getAllWithImages = async (req, res) => {
  try {
    const activitiesRes = await pool.query('SELECT * FROM activities ORDER BY created_at DESC');
    const imagesRes = await pool.query('SELECT * FROM activity_images');

    const activities = activitiesRes.rows.map((activity) => ({
      ...activity,
      images: imagesRes.rows
        .filter((img) => img.activity_id === activity.id)
        .map((img) => img.image_url),
    }));

    res.json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// CREATE activité
exports.create = async (req, res) => {
  try {
    const { title, description, activity_date } = req.body;
    const result = await pool.query(
      'INSERT INTO activities (title, description, activity_date) VALUES ($1, $2, $3) RETURNING *',
      [title, description, activity_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// UPDATE activité
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, activity_date } = req.body;

    const result = await pool.query(
      'UPDATE activities SET title = $1, description = $2, activity_date = $3 WHERE id = $4 RETURNING *',
      [title, description, activity_date, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Activité introuvable' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// DELETE activité
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM activities WHERE id = $1', [id]);
    res.json({ message: 'Activité supprimée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};