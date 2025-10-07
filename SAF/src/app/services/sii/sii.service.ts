import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface FacturaSII {
  folio: number;
  tipoDTE: number;
  rutEmisor: string;
  rutReceptor: string;
  fechaEmision: string;
  montoTotal: number;
  montoNeto: number;
  iva: number;
  estado: string;
  trackId?: string;
}

export interface RespuestaSII {
  respuesta: {
    documentos: FacturaSII[];
    totalDocumentos: number;
  };
  estado: string;
  mensaje?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SiiService {
  // URLs de la API del SII (Ambiente de Certificación)
  private readonly SII_API_CERT = 'https://maullin.sii.cl/DTEWS';
  // URLs de la API del SII (Ambiente de Producción)
  private readonly SII_API_PROD = 'https://palena.sii.cl/DTEWS';
  
  private apiUrl: string = this.SII_API_CERT; // Cambiar a SII_API_PROD en producción
  
  // Credenciales y certificado
  private rutEmpresa: string = '';
  private certificadoBase64: string = '';
  private passwordCertificado: string = '';
  private token: string = '';

  constructor(private http: HttpClient) {}

  /**
   * Configura las credenciales para acceder a la API del SII
   */
  configurarCredenciales(rut: string, certificadoBase64: string, password: string) {
    this.rutEmpresa = rut;
    this.certificadoBase64 = certificadoBase64;
    this.passwordCertificado = password;
  }

  /**
   * Cambia entre ambiente de certificación y producción
   */
  setAmbiente(tipo: 'certificacion' | 'produccion') {
    this.apiUrl = tipo === 'produccion' ? this.SII_API_PROD : this.SII_API_CERT;
  }

  /**
   * Obtiene el token de autenticación del SII
   */
  private async obtenerToken(): Promise<string> {
    try {
      // El SII requiere autenticación mediante semilla
      const semilla = await this.getSemilla();
      const firma = await this.firmarSemilla(semilla);
      const token = await this.getToken(firma);
      this.token = token;
      return token;
    } catch (error) {
      console.error('Error obteniendo token del SII:', error);
      throw error;
    }
  }

  /**
   * Obtiene la semilla para autenticación
   */
  private getSemilla(): Promise<string> {
    const url = `${this.apiUrl}/CrSeed.jws?WSDL`;
    return this.http.get(url, { responseType: 'text' })
      .pipe(
        map(response => {
          // Extraer semilla del XML de respuesta
          const match = response.match(/<SEMILLA>(\d+)<\/SEMILLA>/);
          if (match && match[1]) {
            return match[1];
          }
          throw new Error('No se pudo obtener la semilla del SII');
        }),
        catchError(error => {
          console.error('Error obteniendo semilla:', error);
          return throwError(() => error);
        })
      )
      .toPromise() as Promise<string>;
  }

  /**
   * Firma la semilla con el certificado digital
   * NOTA: Esta operación normalmente se hace en el backend por seguridad
   */
  private async firmarSemilla(semilla: string): Promise<string> {
    // En una aplicación real, esta operación DEBE hacerse en el backend
    // porque exponer el certificado en el frontend es un riesgo de seguridad
    
    console.warn('⚠️ ADVERTENCIA: La firma debería hacerse en el backend por seguridad');
    
    // Aquí deberías hacer una llamada a tu backend que maneje la firma
    // Ejemplo:
    // return this.http.post<string>('/api/sii/firmar-semilla', { semilla }).toPromise();
    
    throw new Error('Debe implementar la firma en el backend');
  }

  /**
   * Obtiene el token usando la semilla firmada
   */
  private getToken(semillaFirmada: string): Promise<string> {
    const url = `${this.apiUrl}/GetTokenFromSeed.jws?WSDL`;
    const body = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:def="http://DefaultNamespace">
      <soapenv:Header/>
      <soapenv:Body>
        <def:getToken>
          <def:pszXml>${semillaFirmada}</def:pszXml>
        </def:getToken>
      </soapenv:Body>
    </soapenv:Envelope>`;

    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      'SOAPAction': ''
    });

    return this.http.post(url, body, { headers, responseType: 'text' })
      .pipe(
        map(response => {
          const match = response.match(/<TOKEN>([^<]+)<\/TOKEN>/);
          if (match && match[1]) {
            return match[1];
          }
          throw new Error('No se pudo obtener el token del SII');
        })
      )
      .toPromise() as Promise<string>;
  }

  /**
   * Consulta las facturas emitidas en un rango de fechas
   */
  async consultarFacturasEmitidas(
    fechaDesde: string, 
    fechaHasta: string,
    estado?: string
  ): Promise<FacturaSII[]> {
    try {
      // Asegurarse de tener un token válido
      if (!this.token) {
        await this.obtenerToken();
      }

      // Construir la consulta SOAP
      const url = `${this.apiUrl}/QueryEstDte.jws?WSDL`;
      
      const body = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:def="http://DefaultNamespace">
        <soapenv:Header/>
        <soapenv:Body>
          <def:queryEstDte>
            <def:RutConsultante>${this.rutEmpresa}</def:RutConsultante>
            <def:DvConsultante>${this.calcularDV(this.rutEmpresa)}</def:DvConsultante>
            <def:RutCompania>${this.rutEmpresa}</def:RutCompania>
            <def:DvCompania>${this.calcularDV(this.rutEmpresa)}</def:DvCompania>
            <def:RutReceptor></def:RutReceptor>
            <def:DvReceptor></def:DvReceptor>
            <def:FechaDesde>${fechaDesde}</def:FechaDesde>
            <def:FechaHasta>${fechaHasta}</def:FechaHasta>
            <def:Estado>${estado || ''}</def:Estado>
            <def:Token>${this.token}</def:Token>
          </def:queryEstDte>
        </soapenv:Body>
      </soapenv:Envelope>`;

      const headers = new HttpHeaders({
        'Content-Type': 'text/xml',
        'SOAPAction': ''
      });

      const response = await this.http.post(url, body, { headers, responseType: 'text' }).toPromise();
      
      return this.parsearRespuestaFacturas(response as string);
    } catch (error) {
      console.error('Error consultando facturas del SII:', error);
      throw error;
    }
  }

  /**
   * Consulta el estado de un DTE específico
   */
  async consultarEstadoDTE(
    tipoDTE: number,
    folio: number,
    rutEmisor: string,
    rutReceptor: string,
    fechaEmision: string,
    montoTotal: number
  ): Promise<any> {
    try {
      if (!this.token) {
        await this.obtenerToken();
      }

      const url = `${this.apiUrl}/QueryEstDte.jws?WSDL`;
      
      const body = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:def="http://DefaultNamespace">
        <soapenv:Header/>
        <soapenv:Body>
          <def:getEstDte>
            <def:RutConsultante>${this.rutEmpresa}</def:RutConsultante>
            <def:DvConsultante>${this.calcularDV(this.rutEmpresa)}</def:DvConsultante>
            <def:RutCompania>${rutEmisor}</def:RutCompania>
            <def:DvCompania>${this.calcularDV(rutEmisor)}</def:DvCompania>
            <def:RutReceptor>${rutReceptor}</def:RutReceptor>
            <def:DvReceptor>${this.calcularDV(rutReceptor)}</def:DvReceptor>
            <def:TipoDte>${tipoDTE}</def:TipoDte>
            <def:FolioDte>${folio}</def:FolioDte>
            <def:FechaEmisionDte>${fechaEmision}</def:FechaEmisionDte>
            <def:MontoDte>${montoTotal}</def:MontoDte>
            <def:Token>${this.token}</def:Token>
          </def:getEstDte>
        </soapenv:Body>
      </soapenv:Envelope>`;

      const headers = new HttpHeaders({
        'Content-Type': 'text/xml',
        'SOAPAction': ''
      });

      const response = await this.http.post(url, body, { headers, responseType: 'text' }).toPromise();
      
      return this.parsearRespuestaEstado(response as string);
    } catch (error) {
      console.error('Error consultando estado DTE:', error);
      throw error;
    }
  }

  /**
   * Parsea la respuesta XML del SII para extraer las facturas
   */
  private parsearRespuestaFacturas(xmlResponse: string): FacturaSII[] {
    const facturas: FacturaSII[] = [];
    
    try {
      // Usar DOMParser para parsear el XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlResponse, 'text/xml');
      
      // Extraer documentos (esto varía según el servicio específico del SII)
      const documentos = xmlDoc.getElementsByTagName('Documento');
      
      for (let i = 0; i < documentos.length; i++) {
        const doc = documentos[i];
        
        const factura: FacturaSII = {
          folio: parseInt(this.getElementValue(doc, 'Folio') || '0'),
          tipoDTE: parseInt(this.getElementValue(doc, 'TipoDTE') || '0'),
          rutEmisor: this.getElementValue(doc, 'RutEmisor') || '',
          rutReceptor: this.getElementValue(doc, 'RutReceptor') || '',
          fechaEmision: this.getElementValue(doc, 'FchEmis') || '',
          montoTotal: parseFloat(this.getElementValue(doc, 'MntTotal') || '0'),
          montoNeto: parseFloat(this.getElementValue(doc, 'MntNeto') || '0'),
          iva: parseFloat(this.getElementValue(doc, 'MntIVA') || '0'),
          estado: this.getElementValue(doc, 'Estado') || 'pendiente',
          trackId: this.getElementValue(doc, 'TrackId')
        };
        
        facturas.push(factura);
      }
    } catch (error) {
      console.error('Error parseando respuesta del SII:', error);
    }
    
    return facturas;
  }

  /**
   * Parsea la respuesta de estado de un DTE
   */
  private parsearRespuestaEstado(xmlResponse: string): any {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlResponse, 'text/xml');
      
      return {
        estado: this.getElementValue(xmlDoc, 'EstadoDte'),
        glosaEstado: this.getElementValue(xmlDoc, 'GlosaEstado'),
        errCode: this.getElementValue(xmlDoc, 'ErrCode'),
        glosaError: this.getElementValue(xmlDoc, 'GlosaErr'),
        trackId: this.getElementValue(xmlDoc, 'TrackId')
      };
    } catch (error) {
      console.error('Error parseando estado DTE:', error);
      return null;
    }
  }

  /**
   * Extrae el valor de un elemento XML
   */
  private getElementValue(parent: any, tagName: string): string | undefined {
    const element = parent.getElementsByTagName(tagName)[0];
    return element ? element.textContent || undefined : undefined;
  }

  /**
   * Calcula el dígito verificador de un RUT
   */
  private calcularDV(rut: string): string {
    const rutLimpio = rut.replace(/[^0-9]/g, '');
    let suma = 0;
    let multiplicador = 2;

    for (let i = rutLimpio.length - 1; i >= 0; i--) {
      suma += parseInt(rutLimpio.charAt(i)) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = suma % 11;
    const dv = 11 - resto;

    if (dv === 11) return '0';
    if (dv === 10) return 'K';
    return dv.toString();
  }

  /**
   * Convierte un archivo PFX a Base64
   */
  async convertirPFXaBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Verifica si el certificado está configurado
   */
  isCertificadoConfigurado(): boolean {
    return this.certificadoBase64 !== '' && this.rutEmpresa !== '';
  }
}
