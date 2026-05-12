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