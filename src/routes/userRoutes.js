const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 🌟 ESTA ES LA LÍNEA QUE FALTABA PARA QUE NO CRASHEE 🌟
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Ruta: GET /api/v1/users/all (Solo Admin Maestro)
router.get('/all', verifyToken, authorizeRoles('SUPER_ADMIN'), userController.listAllUsers);

// Ruta: POST /api/v1/users/managers
router.post('/managers', userController.createManager);

module.exports = router;