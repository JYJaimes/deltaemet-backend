const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta: POST /api/v1/auth/setup-password
router.post('/setup-password', authController.setupPassword);

module.exports = router;

// Ruta: POST /api/v1/auth/setup-password
router.post('/setup-password', authController.setupPassword);

// Ruta: POST /api/v1/auth/login
router.post('/login', authController.login); // <-- Añade esta línea

module.exports = router;