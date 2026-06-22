const pool = require('../config/db');

// Busca si el correo ya existe
exports.findUserByEmail = async (email) => {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0]; // Retorna el usuario o undefined si no existe
};

// Inserta al nuevo Gestor
exports.createManager = async (email, setupToken, expiresAt) => {
    const query = `
        INSERT INTO users (username, email, role, account_status, setup_token, setup_token_expires_at)
        VALUES (?, ?, 'GESTOR', 'PENDING_SETUP', ?, ?)
    `;
    const [result] = await pool.execute(query, [email, email, setupToken, expiresAt]);
    return result.insertId; 
};

// 1. ESTA ES LA FUNCIÓN QUE FALTABA: Buscar usuario por el token de 15 min
exports.findUserBySetupToken = async (token) => {
    const query = 'SELECT id, email, setup_token_expires_at FROM users WHERE setup_token = ?';
    const [rows] = await pool.execute(query, [token]);
    return rows[0];
};

// 2. Buscar usuario para iniciar sesión (Login)
exports.findUserForLogin = async (identifier) => {
    const query = 'SELECT * FROM users WHERE username = ? OR email = ?';
    const [rows] = await pool.execute(query, [identifier, identifier]);
    return rows[0];
};

// 3. Activar la cuenta, guardar contraseña y registrar privacidad
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

// Asegúrate de tener: const pool = require('../config/db'); al inicio de este archivo
exports.getAllUsers = async () => {
    const [rows] = await pool.execute('SELECT id, email, role, account_status, created_at FROM users ORDER BY created_at DESC');
    return rows;
};