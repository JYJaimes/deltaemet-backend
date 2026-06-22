const paymentModel = require('../models/paymentModel');

exports.uploadPayment = async (req, res) => {
    try {
        // req.body trae los datos de texto; req.file trae el PDF/JPG
        const { unitId, amountPaid, paymentDate, residentNote } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: 'Debes adjuntar un comprobante (PDF o Imagen).' });
        }

        if (!unitId || !amountPaid || !paymentDate) {
            return res.status(400).json({ error: 'Faltan datos obligatorios (unidad, monto o fecha).' });
        }

        // Construimos la URL local donde se guardó el archivo
        const receiptUrl = `/uploads/${req.file.filename}`;

        // Nota predeterminada si el residente no escribió nada
        const note = residentNote || 'Anexo comprobante de pago, quedo a espera de su respuesta';

        const paymentId = await paymentModel.submitPayment(unitId, amountPaid, paymentDate, receiptUrl, note);

        res.status(201).json({
            message: 'Comprobante enviado exitosamente. Pendiente de revisión.',
            data: {
                paymentId,
                status: 'PENDING',
                receiptUrl
            }
        });

    } catch (error) {
        console.error('Error subiendo comprobante:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

exports.getPendingPayments = async (req, res) => {
    try {
        const pendingPayments = await paymentModel.getPendingPayments();
        
        // Si no hay pagos pendientes, devolvemos un arreglo vacío pero con un mensaje claro
        if (pendingPayments.length === 0) {
            return res.status(200).json({ 
                message: 'No hay pagos pendientes por revisar.',
                data: [] 
            });
        }

        res.status(200).json({
            message: 'Pagos pendientes recuperados exitosamente.',
            data: pendingPayments
        });

    } catch (error) {
        console.error('Error obteniendo pagos pendientes:', error);
        res.status(500).json({ error: 'Error interno del servidor al consultar pagos.' });
    }
};

exports.reviewPayment = async (req, res) => {
    try {
        const { id } = req.params; // El ID del pago (ej. 4) viene en la URL
        const { status, feedback } = req.body;
        const managerId = req.user.id; // Viene del token JWT que interceptó el middleware

        // Validamos que no nos manden estatus inventados
        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ error: 'El estatus debe ser exactamente APPROVED o REJECTED.' });
        }

        const affectedRows = await paymentModel.reviewPayment(id, status, managerId, feedback || null);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Pago no encontrado.' });
        }

        res.status(200).json({
            message: `El pago ha sido ${status === 'APPROVED' ? 'aprobado' : 'rechazado'} exitosamente.`
        });

    } catch (error) {
        console.error('Error revisando pago:', error);
        res.status(500).json({ error: 'Error interno del servidor al procesar la revisión.' });
    }
};

exports.getMyHistory = async (req, res) => {
    try {
        const userId = req.user.id; // Lo sacamos del token de seguridad
        const payments = await require('../models/paymentModel').getMyPayments(userId);
        res.status(200).json({ data: payments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener tu historial de pagos.' });
    }
};