const express = require('express');
const router = express.Router();
const controller = require('../controllers/contacts');

// Public : formulaire de contact (POST)
router.post('/', controller.create);

// Admin : voir tous les messages (GET)
router.get('/all', controller.getAll);

module.exports = router;