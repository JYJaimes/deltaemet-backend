const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    // 1. Buscamos el token en los encabezados (Headers) de la petición
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado o formato inválido.' });
    }

    // 2. Extraemos solo el token (quitamos la palabra "Bearer ")
    const token = authHeader.replace('Bearer ', '');

    try {
        // 3. Verificamos que sea válido y no esté caducado
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Inyectamos los datos del usuario en la petición (req.user) para que el controlador los pueda usar
        req.user = verified;
        
        // 5. Todo en orden, le decimos a Express que continúe hacia el controlador
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado. Por favor, inicia sesión nuevamente.' });
    }
};