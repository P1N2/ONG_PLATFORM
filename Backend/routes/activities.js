const express = require('express');
const router = express.Router();
const controller = require('../controllers/activities');

// Route combinée pour toutes les activités avec images
router.get('/with-images', controller.getAllWithImages);

// Routes classiques
router.post('/', controller.create);
router.delete('/:id', controller.remove);

module.exports = router;