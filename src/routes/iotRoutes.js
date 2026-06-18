const express = require('express');
const router = express.Router();
const iotController = require('../controllers/iotController');

// POST /api/v1/iot/readings
router.post('/readings', iotController.postReading);

module.exports = router;
router.get('/readings', iotController.getReadings);