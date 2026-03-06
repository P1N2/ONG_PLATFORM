const express = require('express');
const router = express.Router();
const controller = require('../controllers/services');
const { requireAdmin } = require('../middleware/auth');

// GET tous les services (public)
router.get('/', controller.getAll);

// CREATE service (admin)
router.post('/', requireAdmin, controller.create);

// UPDATE service (admin)
router.put('/:id', requireAdmin, controller.update);

// DELETE service (admin)
router.delete('/:id', requireAdmin, controller.remove);

module.exports = router;