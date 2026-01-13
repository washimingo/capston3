require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const dbConfig = require('../config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware (solo para desarrollo)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Routes
const empresasRoutes = require('../routes/empresas');
app.use('/api/empresas', empresasRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando correctamente' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'API de Empresas SAF',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      empresas: '/api/empresas',
      empresaPorRut: '/api/empresas/:rut',
      empresasBatch: '/api/empresas/batch',
      empresaNombre: '/api/empresas/nombre'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado'
  });
});

// Test database connection and start server
async function startServer() {
  try {
    await sql.connect(dbConfig);
    console.log('✓ Base de datos conectada');

    app.listen(PORT, () => {
      console.log(`✓ API SAF ejecutándose en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('✗ Error al iniciar servidor:', error.message);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\nCerrando servidor...');
  try {
    await sql.close();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
});

startServer();
