const jwt = require('jsonwebtoken');

exports.generateAuthToken = (user) => {
    // El "payload" son los datos públicos que viajan dentro del token.
    // NUNCA pongas contraseñas aquí. Solo IDs y Roles.
    const payload = {
        id: user.id,
        role: user.role
    };

    // Firmamos el token con tu secreto y le damos 8 horas de vida (una jornada laboral)
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
};