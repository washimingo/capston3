const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');

/**
 * @route GET /api/empresas
 * @desc Obtiene todas las empresas
 */
router.get('/', async (req, res) => {
  try {
    const empresas = await empresaController.getAllEmpresas();
    res.json({
      success: true,
      data: empresas,
      count: empresas.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener empresas',
      error: error.message
    });
  }
});

/**
 * @route GET /api/empresas/:rut
 * @desc Obtiene una empresa por RUT
 */
router.get('/:rut', async (req, res) => {
  try {
    const { rut } = req.params;
    const empresa = await empresaController.getEmpresaByRut(rut);
    
    if (!empresa) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }

    res.json({
      success: true,
      data: empresa
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener empresa',
      error: error.message
    });
  }
});

/**
 * @route POST /api/empresas/batch
 * @desc Obtiene múltiples empresas por RUTs
 * @body { "ruts": ["12345678", "87654321"] }
 */
router.post('/batch', async (req, res) => {
  try {
    const { ruts } = req.body;
    
    if (!ruts || !Array.isArray(ruts)) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un array de RUTs'
      });
    }

    const empresas = await empresaController.getEmpresasByRuts(ruts);
    res.json({
      success: true,
      data: empresas,
      count: empresas.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener empresas',
      error: error.message
    });
  }
});

/**
 * @route POST /api/empresas/nombre
 * @desc Obtiene el nombre de una empresa por RUT completo
 * @body { "rut": "12345678-9" }
 */
router.post('/nombre', async (req, res) => {
  try {
    const { rut } = req.body;
    
    if (!rut) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un RUT'
      });
    }

    const empresa = await empresaController.getNombreByRutCompleto(rut);
    
    if (!empresa) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }

    res.json({
      success: true,
      data: {
        rut: `${empresa.emp_rut}-${empresa.emp_dv}`,
        nombre: empresa.emp_nombre
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener nombre de empresa',
      error: error.message
    });
  }
});

module.exports = router;
