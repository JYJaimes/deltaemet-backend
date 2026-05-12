require('dotenv').config();
const app = require('./app');
require('./config/db'); // Importamos la db para que intente conectar al arrancar

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(` Servidor de DeltaEmet corriendo en http://localhost:${PORT}`);
});