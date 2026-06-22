const pool = require('../config/db');

exports.submitPayment = async (unitId, amountPaid, paymentDate, receiptUrl, residentNote) => {
    const query = `
        INSERT INTO payments (unit_id, amount_paid, payment_date, receipt_file_url, resident_note, status)
        VALUES (?, ?, ?, ?, ?, 'PENDING')
    `;
    const [result] = await pool.execute(query, [unitId, amountPaid, paymentDate, receiptUrl, residentNote]);
    return result.insertId;
    
};

exports.getPendingPayments = async () => {
    // Usamos JOINs para que el Gestor vea "Torre Delta - Depto 101A" en lugar de solo "unit_id: 1"
    const query = `
        SELECT 
            p.id AS payment_id,
            b.name AS building_name,
            u.unit_number,
            p.amount_paid,
            p.payment_date,
            p.receipt_file_url,
            p.resident_note,
            p.created_at
        FROM payments p
        JOIN units u ON p.unit_id = u.id
        JOIN buildings b ON u.building_id = b.id
        WHERE p.status = 'PENDING'
        ORDER BY p.created_at ASC
    `;
    const [rows] = await pool.execute(query);
    return rows;
};

exports.reviewPayment = async (paymentId, status, managerId, feedback) => {
    const query = `
        UPDATE payments 
        SET status = ?, 
            reviewed_by = ?, 
            manager_feedback = ? 
        WHERE id = ?
    `;
    const [result] = await pool.execute(query, [status, managerId, feedback, paymentId]);
    return result.affectedRows;
};

exports.getMyPayments = async (userId) => {
    const query = `
        SELECT p.id, p.amount_paid, p.payment_date, p.status, p.manager_feedback 
        FROM payments p
        JOIN units u ON p.unit_id = u.id
        WHERE u.resident_id = ?
        ORDER BY p.created_at DESC
    `;
    const [rows] = await pool.execute(query, [userId]);
    return rows;
};