const express = require('express');
const router = express.Router();
const controller = require('../controllers/images');

router.post('/', controller.add);
router.get('/:activityId', controller.getByActivity);

module.exports = router;