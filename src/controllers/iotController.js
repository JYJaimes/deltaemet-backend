const iotModel = require('../models/iotModel');

exports.postReading = async (req, res) => {
    try {
        const { buildingId, sensorType, readingValue, locationZone } = req.body;

        // Validaciones básicas de entrada
        if (!buildingId || !sensorType || readingValue === undefined || !locationZone) {
            return res.status(400).json({ error: 'Faltan datos obligatorios en la telemetría.' });
        }

        // Lógica de umbrales para el prototipo inicial
        let alertStatus = 'NORMAL';
        const value = parseFloat(readingValue);

        if (sensorType === 'AIR_QUALITY') {
            // Ejemplo: MQ-135 arroja valores analógicos altos al detectar humo/gas
            if (value > 600) alertStatus = 'CRITICAL';
            else if (value > 350) alertStatus = 'WARNING';
        } else if (sensorType === 'WATER_LEVEL') {
            // Ejemplo: Si el sensor mide el porcentaje de llenado (0 a 100)
            if (value < 20) alertStatus = 'CRITICAL'; // Cisterna casi vacía
            else if (value < 40) alertStatus = 'WARNING';
        }

        const readingId = await iotModel.insertReading(buildingId, sensorType, value, locationZone, alertStatus);

        // Respondemos rápido al ESP32 para que libere la conexión Wi-Fi
        res.status(201).json({
            message: 'Lectura de telemetría registrada.',
            readingId,
            alertStatus
        });

    } catch (error) {
        console.error('Error procesando telemetría IoT:', error);
        res.status(500).json({ error: 'Error interno del servidor al procesar datos del sensor.' });
    }
};

exports.getReadings = async (req, res) => {
    try {
        const readings = await require('../models/iotModel').getRecentReadings();
        res.status(200).json({ data: readings });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener lecturas.' });
    }
};