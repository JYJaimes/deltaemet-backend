// Esta función recibe un arreglo con los roles permitidos para una ruta específica
exports.authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // req.user viene del authMiddleware, así que debe ejecutarse después de él
        if (!req.user || !req.user.role) {
            return res.status(401).json({ error: 'No se pudo identificar el rol del usuario.' });
        }

        // Verificamos si el rol del usuario está dentro de los permitidos
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'No tienes los permisos necesarios para realizar esta acción.' });
        }

        next(); // Tiene el rol correcto, puede pasar
    };
};