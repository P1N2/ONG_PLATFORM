const express = require('express');
const router = express.Router();
const controller = require('../controllers/services');

// GET tous les services
router.get('/', controller.getAll);

// CREATE service
router.post('/', controller.create);

// DELETE service
router.delete('/:id', controller.remove);

module.exports = router;