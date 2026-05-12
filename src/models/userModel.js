const pool = require('../config/db');

// Busca si el correo ya existe
exports.findUserByEmail = async (email) => {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0]; // Retorna el usuario o undefined si no existe
};

// Inserta al nuevo Gestor
exports.createManager = async (email, setupToken, expiresAt) => {
    // Como acordamos, el username inicial será el correo
    const query = `
        INSERT INTO users (username, email, role, account_status, setup_token, setup_token_expires_at)
        VALUES (?, ?, 'GESTOR', 'PENDING_SETUP', ?, ?)
    `;
    const [result] = await pool.execute(query, [email, email, setupToken, expiresAt]);
    return result.insertId; // Retorna el ID del nuevo usuario
};

// Buscar usuario por su token
exports.findUserForLogin = async (identifier) => {
    const query = 'SELECT * FROM users WHERE username = ? OR email = ?';
    const [rows] = await pool.execute(query, [identifier, identifier]);
    return rows[0];
};

// Activar la cuenta, guardar la contraseña hasheada y registrar el aviso de privacidad
exports.activateManagerAccount = async (userId, hashedPassword) => {
    const query = `
        UPDATE users 
        SET password_hash = ?, 
            account_status = 'ACTIVE', 
            setup_token = NULL, 
            setup_token_expires_at = NULL,
            privacy_policy_accepted_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;
    const [result] = await pool.execute(query, [hashedPassword, userId]);
    return result.affectedRows;
};