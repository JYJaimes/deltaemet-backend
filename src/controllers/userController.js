const userModel = require('../models/userModel');
const { generateSetupToken } = require('../utils/tokenHelper');

exports.createManager = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'El correo electrónico es obligatorio' });
        }

        // 1. Verificar si el usuario ya existe en DeltaEmet
        const existingUser = await userModel.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Este correo ya está registrado en el sistema' });
        }

        // 2. Generar el token de seguridad (15 min)
        const { token, expiresAt } = generateSetupToken();

        // 3. Guardar en la base de datos MySQL
        const newUserId = await userModel.createManager(email, token, expiresAt);

        // 4. Simulación del envío de correo (Más adelante conectaremos Nodemailer)
        const setupLink = `http://localhost:3000/api/v1/auth/setup-password?token=${token}`;

        res.status(201).json({
            message: 'Gestor creado exitosamente. Correo de configuración pendiente.',
            data: {
                userId: newUserId,
                email: email,
                role: 'GESTOR',
                account_status: 'PENDING_SETUP'
            },
            // TODO: Eliminar mockEmailContent en producción. Se deja para poder probar el flujo.
            mockEmailContent: {
                subject: 'Configura tu cuenta en DeltaEmet',
                link: setupLink
            }
        });

    } catch (error) {
        console.error('Error creando el Gestor:', error);
        res.status(500).json({ error: 'Error interno del servidor al crear el usuario' });
    }
};