const express = require('express');
const router = express.Router();
const controller = require('../controllers/activities');
const { requireAdmin } = require('../middleware/auth');

// Routes classiques (public)
router.get('/', controller.getAll);

// Route combinée pour toutes les activités avec images (public)
router.get('/with-images', controller.getAllWithImages);

router.post('/', requireAdmin, controller.create);
router.put('/:id', requireAdmin, controller.update);
router.delete('/:id', requireAdmin, controller.remove);

module.exports = router;