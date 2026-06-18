const express = require('express');
const cors = require('cors');

// 1. Importamos todas nuestras rutas
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const iotRoutes = require('./routes/iotRoutes');

const app = express();

// 2. Middlewares globales (El orden aquí es VITAL)
app.use(cors()); 
app.use(express.json()); // El traductor de JSON debe ir antes de las rutas

// Ruta de prueba (Health check)
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Servidor DeltaEmet funcionando correctamente' });
});

// 3. Conectamos las rutas a la URL base
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/iot', iotRoutes);

// 4. Exportamos la app ya terminada y configurada
module.exports = app;