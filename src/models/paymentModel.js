const pool = require('../config/db');

exports.submitPayment = async (unitId, amountPaid, paymentDate, receiptUrl, residentNote) => {
    const query = `
        INSERT INTO payments (unit_id, amount_paid, payment_date, receipt_file_url, resident_note, status)
        VALUES (?, ?, ?, ?, ?, 'PENDING')
    `;
    const [result] = await pool.execute(query, [unitId, amountPaid, paymentDate, receiptUrl, residentNote]);
    return result.insertId;
};