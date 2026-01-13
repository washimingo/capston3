const sql = require('mssql');
const dbConfig = require('../config/database');

/**
 * Obtiene todas las empresas de la base de datos
 */
async function getAllEmpresas() {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .query('SELECT emp_rut, emp_dv, emp_nombre FROM dbo.ta_mst_empresa');
    return result.recordset;
  } catch (error) {
    console.error('Error al obtener empresas:', error);
    throw error;
  }
}

/**
 * Obtiene una empresa por RUT
 * @param {string} rut - RUT de la empresa sin el dígito verificador
 */
async function getEmpresaByRut(rut) {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('rut', sql.VarChar, rut)
      .query('SELECT emp_rut, emp_dv, emp_nombre FROM dbo.ta_mst_empresa WHERE emp_rut = @rut');
    return result.recordset[0] || null;
  } catch (error) {
    console.error('Error al obtener empresa por RUT:', error);
    throw error;
  }
}

/**
 * Obtiene múltiples empresas por un array de RUTs
 * @param {Array<string>} ruts - Array de RUTs sin el dígito verificador
 */
async function getEmpresasByRuts(ruts) {
  try {
    if (!ruts || ruts.length === 0) {
      return [];
    }

    const pool = await sql.connect(dbConfig);
    
    // Crear parámetros dinámicos para la consulta IN
    const rutParams = ruts.map((_, i) => `@rut${i}`).join(',');
    const request = pool.request();
    
    // Agregar cada RUT como parámetro
    ruts.forEach((rut, i) => {
      request.input(`rut${i}`, sql.VarChar, rut);
    });

    const query = `SELECT emp_rut, emp_dv, emp_nombre FROM dbo.ta_mst_empresa WHERE emp_rut IN (${rutParams})`;
    const result = await request.query(query);
    
    return result.recordset;
  } catch (error) {
    console.error('Error al obtener empresas por RUTs:', error);
    throw error;
  }
}

/**
 * Obtiene el nombre de una empresa por RUT completo (con o sin dígito verificador)
 * @param {string} rutCompleto - RUT completo (ej: "12345678-9" o "12345678")
 */
async function getNombreByRutCompleto(rutCompleto) {
  try {
    // Limpiar el RUT (quitar puntos, guiones y espacios)
    const rutLimpio = rutCompleto.replace(/\./g, '').replace(/-/g, '').trim();
    
    // Separar el RUT del dígito verificador
    let rut, dv;
    if (rutLimpio.length > 1) {
      rut = rutLimpio.slice(0, -1);
      dv = rutLimpio.slice(-1);
    } else {
      rut = rutLimpio;
      dv = null;
    }

    const pool = await sql.connect(dbConfig);
    const request = pool.request().input('rut', sql.VarChar, rut);
    
    let query = 'SELECT emp_rut, emp_dv, emp_nombre FROM dbo.ta_mst_empresa WHERE emp_rut = @rut';
    
    if (dv) {
      request.input('dv', sql.VarChar, dv);
      query += ' AND emp_dv = @dv';
    }
    
    const result = await request.query(query);
    return result.recordset[0] || null;
  } catch (error) {
    console.error('Error al obtener nombre por RUT completo:', error);
    throw error;
  }
}

module.exports = {
  getAllEmpresas,
  getEmpresaByRut,
  getEmpresasByRuts,
  getNombreByRutCompleto
};
