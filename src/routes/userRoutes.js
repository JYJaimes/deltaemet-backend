const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Ruta: POST /api/v1/users/managers
router.post('/managers', userController.createManager);

module.exports = router;