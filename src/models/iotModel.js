const pool = require('../config/db');

exports.insertReading = async (buildingId, sensorType, readingValue, locationZone, alertStatus) => {
    const query = `
        INSERT INTO sensor_readings (building_id, sensor_type, reading_value, location_zone, alert_status)
        VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [buildingId, sensorType, readingValue, locationZone, alertStatus]);
    return result.insertId;
};

exports.getRecentReadings = async () => {
    const [rows] = await pool.execute('SELECT * FROM sensor_readings ORDER BY created_at DESC LIMIT 10');
    return rows;
};