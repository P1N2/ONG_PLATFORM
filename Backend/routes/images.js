const express = require('express');
const router = express.Router();
const controller = require('../controllers/images');

// Ajouter une image
router.post('/', controller.add);

// Récupérer les images d’une activité
router.get('/:activityId', controller.getByActivity);

module.exports = router;