const express = require('express');
const cors = require('cors');

// 1. Importamos nuestras rutas
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Middlewares globales
app.use(cors()); 
app.use(express.json()); 

// Ruta de prueba (Health check)
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Servidor DeltaEmet funcionando correctamente' });
});

// 2. Conectamos las rutas a la URL base
app.use('/api/v1/users', userRoutes);

module.exports = app;

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/payments', paymentRoutes)