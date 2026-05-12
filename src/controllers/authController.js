const userModel = require('../models/userModel');
const { hashPassword } = require('../utils/hashPassword');
const bcrypt = require('bcrypt');
const { generateAuthToken } = require('../utils/jwtHelper');

exports.setupPassword = async (req, res) => {
    try {
        const { token } = req.query; // Capturamos el token de la URL (?token=...)
        const { password, privacyAccepted } = req.body; // Capturamos los datos del formulario

        if (!token || !password || privacyAccepted !== true) {
            return res.status(400).json({ error: 'Faltan datos, token inválido o no se aceptó el aviso de privacidad.' });
        }

        // 1. Buscar al usuario por el token
        const user = await userModel.findUserBySetupToken(token);
        
        if (!user) {
            return res.status(400).json({ error: 'Token inválido o la cuenta ya fue activada.' });
        }

        // 2. Verificar que el token no haya caducado (los 15 min de vida)
        if (new Date() > new Date(user.setup_token_expires_at)) {
            return res.status(400).json({ error: 'El enlace ha expirado. Solicita uno nuevo al administrador.' });
        }

        // 3. Hashear la contraseña
        const hashedPassword = await hashPassword(password);

        // 4. Actualizar la base de datos (Cumplimiento LFPDPPP y limpieza de token)
        await userModel.activateManagerAccount(user.id, hashedPassword);

        res.status(200).json({ message: 'Cuenta activada exitosamente. Ya puedes iniciar sesión.' });

    } catch (error) {
        console.error('Error configurando cuenta:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body; // identifier puede ser correo o username

        if (!identifier || !password) {
            return res.status(400).json({ error: 'Debes proporcionar un usuario/correo y contraseña.' });
        }

        // 1. Buscar al usuario
        const user = await userModel.findUserForLogin(identifier);
        
        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // 2. Verificar que la cuenta esté activa
        if (user.account_status !== 'ACTIVE') {
            return res.status(403).json({ error: 'Tu cuenta está suspendida o pendiente de activación.' });
        }

        // 3. Comparar la contraseña ingresada con el Hash de la BD
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // 4. Si todo es correcto, emitimos el JWT
        const token = generateAuthToken(user);

        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token: token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};