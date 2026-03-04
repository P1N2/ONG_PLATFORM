const express = require('express');
const router = express.Router();
const controller = require('../controllers/admins');
const { body, validationResult } = require('express-validator');
const auth = require('../middlewares/auth');

// ========== CREATE ADMIN ==========
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Le nom est requis'),
    body('email').isEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit faire au moins 6 caractères')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  controller.create
);

// ========== LOGIN ADMIN ==========
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email invalide'),
    body('password').notEmpty().withMessage('Mot de passe requis')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  controller.login
);

module.exports = router;