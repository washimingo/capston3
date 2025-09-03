import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Factura } from 'src/app/interfaces/invoice/factura';

@Injectable({
  providedIn: 'root'
})
export class Apisimulada {
  private apiUrl = 'https://api-sii-simulacion.vercel.app/api/facturas';

  constructor(private http: HttpClient) {}

  getFacturas(): Observable<{ total: number; facturas: Factura[] }> {
    return this.http.get<{ total: number; facturas: Factura[] }>(this.apiUrl);
  }

  getFactura(id: string): Observable<Factura> {
    return this.http.get<Factura>(`${this.apiUrl}/${id}`);
  }

  crearFactura(factura: Partial<Factura>): Observable<Factura> {
    return this.http.post<Factura>(this.apiUrl, factura);
  }

  actualizarFactura(id: string, estado: string): Observable<Factura> {
    return this.http.put<Factura>(`${this.apiUrl}/${id}`, { estado });
  }

  anularFactura(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}