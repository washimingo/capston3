import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge, IonIcon, IonButton, IonGrid, IonRow, IonCol, IonRefresher, IonRefresherContent, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Apisimulada } from 'src/app/services/api/apisimulada';
import { Factura as ApiFactura } from 'src/app/interfaces/invoice/factura';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge, IonIcon, IonButton, IonGrid, IonRow, IonCol, IonRefresher, IonRefresherContent, IonList, IonItem, IonLabel]
})
export class HomePage implements OnInit {
  facturas: ApiFactura[] = [];
  totalFacturas = 0; // total reportado por la API o length
  totalEmitidas = 0;
  totalRecibidas = 0;
  totalAnuladas = 0;
  cargando = false;

  // Listas recientes por estado
  ultimasEmitidas: ApiFactura[] = [];
  ultimasRecibidas: ApiFactura[] = [];
  ultimasAnuladas: ApiFactura[] = [];

  constructor(
    private router: Router,
    private apiSimulada: Apisimulada
  ) {}

  // Datos para posibles gráficas futuras
  get datosGraficaPorEstado() {
    return {
      Emitida: this.totalEmitidas,
      Recibida: this.totalRecibidas,
      Anulada: this.totalAnuladas
    };
  }

  irAFacturasConFiltro(estado: string) {
    if (estado) {
      this.router.navigate(['/invoices'], { queryParams: { estado } });
    } else {
      this.router.navigate(['/invoices']);
    }
  }

  verFacturaDesdeHome(f: ApiFactura) {
    const estado = (f.estado || '').charAt(0).toUpperCase() + (f.estado || '').slice(1).toLowerCase();
    this.router.navigate(['/invoices'], {
      queryParams: {
        estado,
        abrirDetalle: 'true',
        facturaId: f.id
      }
    });
  }

  async ngOnInit() {
    await this.cargarFacturasDesdeApi();
    this.calcularTotales();
  }

  async cargarFacturasDesdeApi() {
    this.cargando = true;
    try {
      this.apiSimulada.getFacturas().subscribe({
        next: (resp) => {
          if (resp && Array.isArray(resp.facturas)) {
            this.facturas = resp.facturas;
            this.totalFacturas = resp.total ?? resp.facturas.length;
          } else if (Array.isArray((resp as any))) {
            this.facturas = resp as unknown as ApiFactura[];
            this.totalFacturas = this.facturas.length;
          } else {
            this.facturas = [];
            this.totalFacturas = 0;
          }
        },
        error: () => {
          this.facturas = [];
          this.totalFacturas = 0;
        },
        complete: () => {
          this.calcularTotales();
          this.cargando = false;
        }
      });
    } catch (e) {
      this.facturas = [];
      this.totalFacturas = 0;
      this.cargando = false;
    }
  }

  calcularTotales() {
    const norm = (v: string | undefined) => (v || '').toLowerCase();
    this.totalEmitidas = this.facturas.filter(f => norm(f.estado) === 'emitida').length;
    this.totalRecibidas = this.facturas.filter(f => norm(f.estado) === 'recibida').length;
    this.totalAnuladas = this.facturas.filter(f => norm(f.estado) === 'anulada').length;

    const sortDesc = (a: ApiFactura, b: ApiFactura) => {
      const ta = new Date(a.fechaEmision || '').getTime() || 0;
      const tb = new Date(b.fechaEmision || '').getTime() || 0;
      return tb - ta;
    };
    this.ultimasEmitidas = this.facturas.filter(f => norm(f.estado) === 'emitida').sort(sortDesc).slice(0, 5);
    this.ultimasRecibidas = this.facturas.filter(f => norm(f.estado) === 'recibida').sort(sortDesc).slice(0, 5);
    this.ultimasAnuladas = this.facturas.filter(f => norm(f.estado) === 'anulada').sort(sortDesc).slice(0, 5);
  }

  async refrescar(event: any) {
    await this.cargarFacturasDesdeApi();
    this.calcularTotales();
    event.target.complete();
  }

  getColorEstado(estado: string): string {
    const e = (estado || '').toLowerCase();
    if (e === 'emitida') return 'primary';
    if (e === 'recibida') return 'success';
    if (e === 'anulada') return 'danger';
    return 'medium';
  }
}
