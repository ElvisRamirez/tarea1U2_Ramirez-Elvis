// src/index.js
const connectDB = require('./config/database');
const { ejecutarConsultas } = require('./queries/consultas');

const main = async () => {
  try {
    console.log('🚀 Iniciando aplicación MongoDB con Mongoose\n');
    
    // Conectar a la base de datos
    await connectDB();
    
    // Ejecutar consultas de demostración
    await ejecutarConsultas();
    
  } catch (error) {
    console.error('❌ Error en la aplicación:', error);
    process.exit(1);
  }
};

main();