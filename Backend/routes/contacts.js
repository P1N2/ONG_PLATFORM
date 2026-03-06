const express = require('express');
const router = express.Router();
const controller = require('../controllers/contacts');
const { requireAdmin } = require('../middleware/auth');

// Public : formulaire de contact (POST)
router.post('/', controller.create);


// Admin : voir tous les messages (GET)
router.get('/all', requireAdmin, controller.getAll);

// Admin : modifier un message
router.put('/:id', requireAdmin, controller.update);

// Admin : supprimer un message
router.delete('/:id', requireAdmin, controller.remove);

module.exports = router;