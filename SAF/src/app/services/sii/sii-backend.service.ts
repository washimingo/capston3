import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ConfiguracionSII {
  rut: string;
  certificado: string; // Base64
  password: string;
  ambiente: 'certificacion' | 'produccion';
}

@Injectable({
  providedIn: 'root'
})
export class SiiBackendService {
  // URL de tu backend (ajustar según tu configuración)
  private backendUrl = 'http://localhost:3000/api/sii';

  constructor(private http: HttpClient) {}

  /**
   * Configura el certificado en el backend
   */
  configurarCertificado(config: ConfiguracionSII): Observable<any> {
    return this.http.post(`${this.backendUrl}/configurar`, config);
  }

  /**
   * Obtiene el token de autenticación del SII
   */
  obtenerToken(): Observable<{ token: string }> {
    return this.http.get<{ token: string }>(`${this.backendUrl}/token`);
  }

  /**
   * Consulta facturas emitidas
   */
  consultarFacturas(params: {
    fechaDesde: string;
    fechaHasta: string;
    estado?: string;
  }): Observable<any> {
    return this.http.post(`${this.backendUrl}/facturas`, params);
  }

  /**
   * Consulta el estado de un DTE específico
   */
  consultarEstadoDTE(params: {
    tipoDTE: number;
    folio: number;
    rutEmisor: string;
    rutReceptor: string;
    fechaEmision: string;
    montoTotal: number;
  }): Observable<any> {
    return this.http.post(`${this.backendUrl}/estado-dte`, params);
  }

  /**
   * Sube el archivo PFX al backend
   */
  subirCertificado(formData: FormData): Observable<any> {
    return this.http.post(`${this.backendUrl}/subir-certificado`, formData);
  }
}
