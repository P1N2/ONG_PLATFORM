const express = require('express');
const router = express.Router();
const controller = require('../controllers/images');
const { requireAdmin } = require('../middleware/auth');

// Ajouter une image (admin)
router.post('/', requireAdmin, controller.add);

// Récupérer les images d’une activité
router.get('/:activityId', controller.getByActivity);

module.exports = router;