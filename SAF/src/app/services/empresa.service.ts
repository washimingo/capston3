import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Empresa {
  emp_rut: string | number;
  emp_dv: string;
  emp_nombre: string;
}

export interface EmpresaResponse {
  success: boolean;
  data?: Empresa | Empresa[];
  count?: number;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl = 'http://localhost:3000/api/empresas';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las empresas
   */
  getAllEmpresas(): Observable<Empresa[]> {
    return this.http.get<EmpresaResponse>(this.apiUrl).pipe(
      map(response => {
        if (response.success && Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      }),
      catchError(error => {
        console.error('Error al obtener empresas:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtiene una empresa por RUT
   * @param rut RUT sin dígito verificador
   */
  getEmpresaByRut(rut: string): Observable<Empresa | null> {
    // Limpiar el RUT (quitar puntos, guiones)
    const rutLimpio = this.limpiarRut(rut);
    
    return this.http.get<EmpresaResponse>(`${this.apiUrl}/${rutLimpio}`).pipe(
      map(response => {
        if (response.success && response.data && !Array.isArray(response.data)) {
          return response.data;
        }
        return null;
      }),
      catchError(error => {
        console.error(`Error al obtener empresa con RUT ${rut}:`, error);
        return of(null);
      })
    );
  }

  /**
   * Obtiene el nombre de una empresa por RUT completo
   * @param rut RUT completo (con o sin dígito verificador)
   */
  getNombreByRut(rut: string): Observable<string> {
    const rutLimpio = this.limpiarRut(rut);
    
    return this.http.post<any>(`${this.apiUrl}/nombre`, { rut: rutLimpio }).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data.nombre;
        }
        return '';
      }),
      catchError(error => {
        console.error(`Error al obtener nombre para RUT ${rut}:`, error);
        return of('');
      })
    );
  }

  /**
   * Obtiene múltiples empresas por un array de RUTs
   * @param ruts Array de RUTs
   */
  getEmpresasByRuts(ruts: string[]): Observable<Empresa[]> {
    console.log('🔍 Buscando empresas por RUTs:', ruts);
    
    if (!ruts || ruts.length === 0) {
      return of([]);
    }

    // Limpiar todos los RUTs
    const rutsLimpios = ruts.map(rut => this.limpiarRut(rut));
    console.log('🧹 RUTs limpios:', rutsLimpios);
    
    return this.http.post<EmpresaResponse>(`${this.apiUrl}/batch`, { ruts: rutsLimpios }).pipe(
      map(response => {
        console.log('📡 Respuesta de API batch:', response);
        if (response.success && Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      }),
      catchError(error => {
        console.error('❌ Error al obtener empresas por lote:', error);
        return of([]);
      })
    );
  }

  /**
   * Enriquece un array de facturas con los nombres de las empresas
   * @param facturas Array de facturas con campo 'RUT Emisor' que contiene el RUT
   */
  enriquecerFacturasConNombres(facturas: any[]): Observable<any[]> {
    console.log('🔍 Iniciando enriquecimiento de facturas:', facturas.length);
    
    if (!facturas || facturas.length === 0) {
      return of([]);
    }

    // Extraer RUTs únicos de las facturas desde el campo "RUT Emisor"
    const ruts = [...new Set(facturas.map(f => 
      this.extraerRutDeProveedor(f['RUT Emisor'] || f.proveedor || '')
    ).filter(rut => rut !== ''))];
    
    console.log('📋 RUTs únicos extraídos para buscar:', ruts.length);
    console.log('🎯 Algunos RUTs de ejemplo:', ruts.slice(0, 5));
    
    return this.getEmpresasByRuts(ruts).pipe(
      map(empresas => {
        console.log('🏢 Empresas encontradas en la BD:', empresas.length);
        console.log('📊 Tasa de coincidencia: ' + 
          Math.round((empresas.length / ruts.length) * 100) + '% ' +
          `(${empresas.length} de ${ruts.length})`);
        
        // Crear un mapa de RUT -> Empresa para búsqueda rápida
        const empresaMap = new Map<string, Empresa>();
        empresas.forEach(emp => {
          // Convertir emp_rut a string para asegurar consistencia
          empresaMap.set(emp.emp_rut.toString(), emp);
        });
        
        console.log('🗺️ Mapa de empresas creado:', empresaMap.size, 'entradas');

        // Estadísticas de enriquecimiento
        let facturasConNombre = 0;
        let facturasSinNombre = 0;

        // Enriquecer cada factura con el nombre de la empresa
        const facturasEnriquecidas = facturas.map(factura => {
          const rutFactura = this.extraerRutDeProveedor(factura['RUT Emisor'] || factura.proveedor || '');
          const empresa = empresaMap.get(rutFactura);
          
          const facturaEnriquecida = {
            ...factura,
            nombreEmpresa: empresa ? empresa.emp_nombre : '',
            rutEmisor: factura['RUT Emisor'] || factura.proveedor || ''
          };
          
          if (empresa) {
            facturasConNombre++;
          } else {
            facturasSinNombre++;
          }
          
          return facturaEnriquecida;
        });
        
        console.log('✅ Enriquecimiento completado:');
        console.log(`   📈 Facturas con nombre de empresa: ${facturasConNombre}`);
        console.log(`   📉 Facturas solo con RUT: ${facturasSinNombre}`);
        console.log(`   🎯 Total procesado: ${facturasEnriquecidas.length}`);
        
        return facturasEnriquecidas;
      })
    );
  }

  /**
   * Limpia un RUT quitando puntos, guiones y espacios
   * @param rut RUT a limpiar
   */
  private limpiarRut(rut: string): string {
    if (!rut) return '';
    return rut.replace(/\./g, '').replace(/-/g, '').trim();
  }

  /**
   * Extrae el RUT del campo proveedor o RUT Emisor del CSV
   * El CSV tiene formato "RUT Emisor" con valores como "76380151-9"
   * @param proveedor Campo proveedor o RUT Emisor de la factura
   */
  private extraerRutDeProveedor(proveedor: string): string {
    if (!proveedor) return '';
    
    console.log(`🔍 Extrayendo RUT de: "${proveedor}"`);
    
    // Limpiar el RUT completo
    const rutLimpio = this.limpiarRut(proveedor);
    
    // Si tiene más de 1 carácter, quitar el dígito verificador (último carácter)
    let rutExtraido = '';
    if (rutLimpio.length > 1) {
      rutExtraido = rutLimpio.slice(0, -1);
    } else {
      rutExtraido = rutLimpio;
    }
    
    console.log(`✅ RUT extraído: "${proveedor}" -> "${rutExtraido}"`);
    return rutExtraido;
  }

  /**
   * Verifica si la API está disponible
   */
  checkApiHealth(): Observable<boolean> {
    return this.http.get<any>('http://localhost:3000/health').pipe(
      map(response => response.status === 'OK'),
      catchError(() => of(false))
    );
  }
}