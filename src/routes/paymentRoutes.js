const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

// Ruta: POST /api/v1/payments/upload
// OJO: Le pongo 'GESTOR' también para que puedas probarla con tu usuario actual
router.post('/upload', 
    verifyToken, 
    authorizeRoles('RESIDENTE', 'GESTOR'), 
    upload.single('receipt'), // 'receipt' es el nombre del campo que enviaremos en Thunder Client
    paymentController.uploadPayment
);

router.get('/pending',
    verifyToken,
    authorizeRoles('SUPER_ADMIN', 'GESTOR'),
    paymentController.getPendingPayments
);

// Protegida: Solo los administradores pueden aprobar/rechazar dinero
router.put('/:id/review',
    verifyToken,
    authorizeRoles('SUPER_ADMIN', 'GESTOR'),
    paymentController.reviewPayment
);

module.exports = router;