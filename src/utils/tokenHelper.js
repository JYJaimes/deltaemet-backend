const crypto = require('crypto');

exports.generateSetupToken = () => {
    // Genera una cadena hexadecimal aleatoria y segura de 64 caracteres
    const token = crypto.randomBytes(32).toString('hex');
    
    // Calcula la fecha actual + 15 minutos
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); 
    
    return { token, expiresAt };
};