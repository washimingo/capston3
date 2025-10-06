import { Injectable } from '@angular/core';
import { Factura } from 'src/app/models/factura.model';

export interface FacturaExtraida {
  folio: string;
  rutEmisor: string;
  fechaEmision: string;
  montoTotal: number;
  razonSocial: string;
  confianza: number;
}

export interface CategoriaIA {
  categoria: string;
  subcategoria: string;
  confianza: number;
  prioridad: string;
  sugerencias: string[];
}

export interface DeteccionDuplicado {
  esDuplicado: boolean;
  facturaOriginal?: Factura;
  similitud?: number;
  recomendacion?: string;
}

export interface AnalisisIA {
  tendenciaMensual: any;
  proveedoresRecurrentes: any[];
  montosPromedio: number;
  recomendaciones: string[];
  alertasImportantes: string[];
  predicciones: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AIService {

  constructor() { }

  // OCR - Extracción de datos de imagen (simulado)
  async procesarFacturaConOCR(imagenFile: File): Promise<FacturaExtraida> {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          const datosSimulados = this.generarDatosOCRSimulados();
          resolve(datosSimulados);
        }, 2000);
      });
    } catch (error) {
      throw new Error('Error procesando factura con IA: ' + error);
    }
  }

  // Procesamiento de CSV - Extracción de datos de fila CSV
  async procesarFacturaDesdeCSV(filaCSV: any): Promise<FacturaExtraida> {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          const datosExtraidos = this.extraerDatosDeCSV(filaCSV);
          resolve(datosExtraidos);
        }, 500);
      });
    } catch (error) {
      throw new Error('Error procesando factura desde CSV: ' + error);
    }
  }

  // Categorización automática
  async categorizarFactura(factura: Factura): Promise<CategoriaIA> {
    const proveedor = factura.proveedor || (factura as any)['Razón Social'] || (factura as any)['RUT Emisor'] || '';
    const monto = factura.monto || (factura as any)['Monto Total'] || 0;
    
    const categoria = this.determinarCategoria(proveedor, monto);
    
    return categoria;
  }

  // Detección de duplicados
  async verificarDuplicados(nuevaFactura: any, facturasExistentes: Factura[]): Promise<DeteccionDuplicado> {
    for (const factura of facturasExistentes) {
      const similitud = this.calcularSimilitud(nuevaFactura, factura);
      
      if (similitud > 0.85) {
        return {
          esDuplicado: true,
          facturaOriginal: factura,
          similitud: similitud,
          recomendacion: this.generarRecomendacionDuplicado(similitud)
        };
      }
    }
    
    return { esDuplicado: false };
  }

  // Análisis predictivo
  analizarPatronesFacturacion(facturas: Factura[]): AnalisisIA {
    return {
      tendenciaMensual: this.calcularTendenciaMensual(facturas),
      proveedoresRecurrentes: this.identificarProveedoresRecurrentes(facturas),
      montosPromedio: this.calcularMontosPromedio(facturas),
      recomendaciones: this.generarRecomendacionesIA(facturas),
      alertasImportantes: this.generarAlertasIA(facturas),
      predicciones: this.generarPrediccionesIA(facturas)
    };
  }

  // Sugerencias de optimización
  generarSugerenciasOptimizacion(facturas: Factura[]): string[] {
    const sugerencias: string[] = [];
    
    const facturasTardias = facturas.filter(f => this.esFacturaTardia(f));
    if (facturasTardias.length > facturas.length * 0.2) {
      sugerencias.push('🔔 IA sugiere: Configurar alertas más tempranas para reducir vencimientos');
    }
    
    const proveedores = new Set(facturas.map(f => f.proveedor || (f as any)['RUT Emisor']));
    if (proveedores.size < facturas.length * 0.3) {
      sugerencias.push('📊 IA detecta: Alta concentración en pocos proveedores');
    }
    
    const montoPromedio = this.calcularMontosPromedio(facturas);
    if (montoPromedio > 500000) {
      sugerencias.push('💰 IA recomienda: Implementar flujo de aprobación para facturas altas');
    }
    
    return sugerencias.length > 0 ? sugerencias : ['✅ IA: Sistema funcionando óptimamente'];
  }

  // Validación de datos
  validarDatosFactura(factura: any): { esValida: boolean; errores: string[]; advertencias: string[] } {
    const errores: string[] = [];
    const advertencias: string[] = [];

    if (!this.validarRUTChileno(factura.rutEmisor || '')) {
      errores.push('RUT emisor inválido');
    }

    if (!factura.montoTotal || factura.montoTotal <= 0) {
      errores.push('Monto total debe ser mayor a 0');
    }

    if (!this.validarFecha(factura.fechaEmision)) {
      errores.push('Fecha de emisión inválida');
    }

    if (factura.montoTotal > 1000000) {
      advertencias.push('Monto inusualmente alto - verificar');
    }

    return {
      esValida: errores.length === 0,
      errores,
      advertencias
    };
  }

  // === MÉTODOS PRIVADOS ===

  private generarDatosOCRSimulados(): FacturaExtraida {
    const folios = ['F123456', 'INV-789012', 'FC-345678', 'DOC-901234'];
    const empresas = [
      { rut: '76.123.456-7', razon: 'Tecnología Avanzada S.A.' },
      { rut: '78.987.654-3', razon: 'Servicios Profesionales Ltda.' },
      { rut: '77.555.444-2', razon: 'Materiales y Suministros S.A.' }
    ];

    const empresa = empresas[Math.floor(Math.random() * empresas.length)];
    const fechaBase = new Date();
    fechaBase.setDate(fechaBase.getDate() - Math.floor(Math.random() * 30));

    return {
      folio: folios[Math.floor(Math.random() * folios.length)],
      rutEmisor: empresa.rut,
      fechaEmision: fechaBase.toISOString().split('T')[0],
      montoTotal: Math.floor(Math.random() * 500000) + 50000,
      razonSocial: empresa.razon,
      confianza: 0.85 + Math.random() * 0.15
    };
  }

  private extraerDatosDeCSV(filaCSV: any): FacturaExtraida {
    // Mapear campos comunes de CSV a nuestro formato
    const folio = filaCSV['Folio'] || filaCSV['folio'] || filaCSV['Número'] || filaCSV['numero'] || `CSV-${Date.now()}`;
    const rutEmisor = filaCSV['RUT'] || filaCSV['rut'] || filaCSV['RUT Emisor'] || filaCSV['rut_emisor'] || '12.345.678-9';
    const fechaEmision = filaCSV['Fecha'] || filaCSV['fecha'] || filaCSV['Fecha Emisión'] || filaCSV['fecha_emision'] || new Date().toISOString().split('T')[0];
    const montoTotal = parseFloat(filaCSV['Monto'] || filaCSV['monto'] || filaCSV['Total'] || filaCSV['total'] || '0') || 0;
    const razonSocial = filaCSV['Razón Social'] || filaCSV['razon_social'] || filaCSV['Empresa'] || filaCSV['empresa'] || filaCSV['Proveedor'] || filaCSV['proveedor'] || 'Sin especificar';

    return {
      folio,
      rutEmisor,
      fechaEmision,
      montoTotal,
      razonSocial,
      confianza: 0.95 // Alta confianza para datos CSV estructurados
    };
  }

  private determinarCategoria(proveedor: string, monto: number): CategoriaIA {
    const texto = proveedor.toLowerCase();
    
    if (texto.includes('tecnolog') || texto.includes('software')) {
      return {
        categoria: 'Tecnología',
        subcategoria: 'Software y Sistemas',
        confianza: 0.92,
        prioridad: 'Alta',
        sugerencias: ['Revisar licencias', 'Validar soporte técnico']
      };
    } else if (texto.includes('servicio') || texto.includes('consultor')) {
      return {
        categoria: 'Servicios',
        subcategoria: 'Consultoría',
        confianza: 0.88,
        prioridad: 'Media',
        sugerencias: ['Verificar entregables', 'Validar horas']
      };
    } else if (texto.includes('material') || texto.includes('suministro')) {
      return {
        categoria: 'Materiales',
        subcategoria: 'Suministros',
        confianza: 0.85,
        prioridad: 'Media',
        sugerencias: ['Verificar inventario', 'Confirmar recepción']
      };
    } else if (monto > 1000000) {
      return {
        categoria: 'Alto Valor',
        subcategoria: 'Requiere Aprobación',
        confianza: 0.90,
        prioridad: 'Crítica',
        sugerencias: ['Requiere aprobación gerencial']
      };
    } else {
      return {
        categoria: 'General',
        subcategoria: 'Otros',
        confianza: 0.75,
        prioridad: 'Baja',
        sugerencias: ['Revisar categorización manual']
      };
    }
  }

  private calcularSimilitud(factura1: any, factura2: Factura): number {
    let similitud = 0;

    // Comparar RUT
    if (factura1.rutEmisor === (factura2 as any)['RUT Emisor']) {
      similitud += 0.4;
    }

    // Comparar monto (tolerancia del 3%)
    const monto1 = factura1.montoTotal || 0;
    const monto2 = factura2.monto || (factura2 as any)['Monto Total'] || 0;
    if (monto1 > 0 && monto2 > 0) {
      const diferencia = Math.abs(monto1 - monto2) / Math.max(monto1, monto2);
      if (diferencia < 0.03) {
        similitud += 0.3;
      }
    }

    // Comparar fecha
    const fecha1 = new Date(factura1.fechaEmision);
    const fecha2 = new Date(factura2.fechaRecepcion || (factura2 as any)['Fecha Recep.'] || '');
    const diferenciaDias = Math.abs((fecha1.getTime() - fecha2.getTime()) / (1000 * 60 * 60 * 24));
    if (diferenciaDias <= 1) {
      similitud += 0.2;
    }

    // Comparar folio
    if (factura1.folio === factura2.folio) {
      similitud += 0.1;
    }

    return similitud;
  }

  private generarRecomendacionDuplicado(similitud: number): string {
    if (similitud > 0.95) {
      return 'Duplicado casi exacto detectado';
    } else if (similitud > 0.9) {
      return 'Alta similitud - revisar cuidadosamente';
    } else {
      return 'Similitud moderada - verificar';
    }
  }

  private calcularTendenciaMensual(facturas: Factura[]): any {
    const tendencia: any = {};
    
    facturas.forEach(factura => {
      const fecha = new Date(factura.fechaRecepcion || (factura as any)['Fecha Recep.'] || '');
      if (!isNaN(fecha.getTime())) {
        const mesAno = fecha.getFullYear() + '-' + (fecha.getMonth() + 1).toString().padStart(2, '0');
        
        if (!tendencia[mesAno]) {
          tendencia[mesAno] = { cantidad: 0, monto: 0 };
        }
        
        tendencia[mesAno].cantidad++;
        tendencia[mesAno].monto += factura.monto || (factura as any)['Monto Total'] || 0;
      }
    });
    
    return tendencia;
  }

  private identificarProveedoresRecurrentes(facturas: Factura[]): any[] {
    const proveedores = new Map();
    
    facturas.forEach(factura => {
      const rut = (factura as any)['RUT Emisor'] || factura.proveedor || 'Sin identificar';
      
      if (!proveedores.has(rut)) {
        proveedores.set(rut, { 
          rut, 
          cantidad: 0, 
          montoTotal: 0,
          razonSocial: (factura as any)['Razón Social'] || 'No especificada'
        });
      }
      
      const datos = proveedores.get(rut);
      datos.cantidad++;
      datos.montoTotal += factura.monto || (factura as any)['Monto Total'] || 0;
    });
    
    return Array.from(proveedores.values())
      .sort((a: any, b: any) => b.cantidad - a.cantidad)
      .slice(0, 10);
  }

  private calcularMontosPromedio(facturas: Factura[]): number {
    if (facturas.length === 0) return 0;
    const total = facturas.reduce((sum, f) => sum + (f.monto || (f as any)['Monto Total'] || 0), 0);
    return total / facturas.length;
  }

  private generarRecomendacionesIA(facturas: Factura[]): string[] {
    const recomendaciones: string[] = [];
    
    if (facturas.length > 100) {
      recomendaciones.push('🤖 Implementar carga automática masiva');
    }
    
    const vencidas = facturas.filter(f => f.estado?.toLowerCase() === 'vencida').length;
    if (vencidas > facturas.length * 0.15) {
      recomendaciones.push('⚠️ Alto porcentaje de facturas vencidas');
    }
    
    recomendaciones.push('📊 Configurar dashboard personalizado');
    
    return recomendaciones;
  }

  private generarAlertasIA(facturas: Factura[]): string[] {
    const alertas: string[] = [];
    
    const hoy = new Date();
    const porVencerHoy = facturas.filter(f => {
      const fechaRecepcion = new Date(f.fechaRecepcion || (f as any)['Fecha Recep.'] || '');
      const fechaVencimiento = new Date(fechaRecepcion);
      fechaVencimiento.setDate(fechaVencimiento.getDate() + 8);
      return fechaVencimiento.toDateString() === hoy.toDateString();
    });
    
    if (porVencerHoy.length > 0) {
      alertas.push(`🚨 ${porVencerHoy.length} facturas vencen HOY`);
    }
    
    return alertas;
  }

  private generarPrediccionesIA(facturas: Factura[]): string[] {
    const predicciones: string[] = [];
    
    const ultimoMes = facturas.filter(f => {
      const fecha = new Date(f.fechaRecepcion || (f as any)['Fecha Recep.'] || '');
      const unMesAtras = new Date();
      unMesAtras.setMonth(unMesAtras.getMonth() - 1);
      return fecha >= unMesAtras;
    });
    
    if (ultimoMes.length > 0) {
      predicciones.push(`📈 Próximo mes: ~${ultimoMes.length} facturas esperadas`);
      
      const montoPromedio = this.calcularMontosPromedio(ultimoMes);
      const estimacion = Math.round(montoPromedio * ultimoMes.length);
      predicciones.push(`💰 Estimación: ~$${estimacion.toLocaleString()}`);
    }
    
    return predicciones;
  }

  private esFacturaTardia(factura: Factura): boolean {
    return factura.estado?.toLowerCase() === 'vencida' || 
           factura.estado?.toLowerCase() === 'atrasada';
  }

  private validarRUTChileno(rut: string): boolean {
    if (!rut) return false;
    const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
    return rutRegex.test(rut);
  }

  private validarFecha(fecha: string): boolean {
    if (!fecha) return false;
    const fechaObj = new Date(fecha);
    return !isNaN(fechaObj.getTime());
  }
}