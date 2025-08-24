
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonBadge,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonModal,
  IonButtons,
  IonButton
} from '@ionic/angular/standalone';

interface Factura {
  id: number;
  cliente: string;
  monto: number;
  estado: string; // Pendiente, Aceptada, Rechazada, Vencida
  fecha: string;
  detalles: string;
}

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.page.html',
  styleUrls: ['./invoices.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule,
    IonCard,
    IonCardContent,
    IonBadge,
    IonList,
    IonItem,
    IonLabel,
    IonText,
    IonModal,
    IonButtons,
    IonButton
  ]
})
export class InvoicesPage {
  facturas: Factura[] = [
    { id: 1, cliente: 'Empresa A', monto: 1000, estado: 'Pendiente', fecha: '2025-08-17', detalles: 'Factura pendiente de pago.' },
    { id: 2, cliente: 'Empresa B', monto: 2000, estado: 'Aceptada', fecha: '2025-07-15', detalles: 'Factura aceptada y pagada.' },
    { id: 3, cliente: 'Empresa C', monto: 1500, estado: 'Rechazada', fecha: '2025-08-17', detalles: 'Factura rechazada por error.' },
    { id: 4, cliente: 'Empresa D', monto: 1800, estado: 'Pendiente', fecha: '2025-08-17', detalles: 'Factura vencida, no pagada.' },
    { id: 5, cliente: 'Empresa E', monto: 1200, estado: 'Pendiente', fecha: '2025-08-10', detalles: 'Factura pendiente de pago.' },
    // ...puedes agregar más facturas aquí...
  ];

  categoriasResumen = [
    { nombre: 'Pendientes', estado: 'Pendiente', color: 'warning' },
    { nombre: 'Aceptadas', estado: 'Aceptada', color: 'success' },
    { nombre: 'Rechazadas', estado: 'Rechazada', color: 'danger' },
    { nombre: 'Vencidas', estado: 'Vencida', color: 'medium' },
  ];

  categoriaSeleccionada: string | null = null;
  mostrarPorVencer: boolean = false;

  getFacturasFiltradas(): Factura[] {
    if (this.mostrarPorVencer) {
      // Filtrar facturas por vencer (<=2 días para el plazo de 8 días desde la fecha)
      const hoy = new Date();
      return this.facturas.filter(f => {
        if (f.estado && f.estado.toLowerCase() === 'pendiente') {
          const fechaEmision = new Date(f.fecha);
          const diffMs = hoy.getTime() - fechaEmision.getTime();
          const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const diasRestantes = 8 - diffDias;
          return diasRestantes <= 2 && diasRestantes > 0;
        }
        return false;
      });
    }
    if (!this.categoriaSeleccionada) {
      return this.facturas;
    }
    // Filtrado exacto, insensible a mayúsculas/minúsculas
    return this.facturas.filter(f =>
      f.estado.toLowerCase() === this.categoriaSeleccionada!.toLowerCase()
    );
  }

  seleccionarCategoria(estado: string) {
    this.mostrarPorVencer = false;
    if (this.categoriaSeleccionada === estado) {
      this.categoriaSeleccionada = null; // Quitar filtro si se vuelve a hacer click
    } else {
      this.categoriaSeleccionada = estado;
    }
  }

  getResumenCount(estado: string): number {
    return this.facturas.filter(f =>
      f.estado.toLowerCase() === estado.toLowerCase()
    ).length;
  }

  // Método para obtener el color del estado (para el ion-badge)
  getColorPorEstado(estado: string): string {
    const cat = this.categoriasResumen.find(c => c.estado === estado);
    return cat ? cat.color : 'primary';
  }


  // Modal de detalles
  facturaSeleccionada: Factura | null = null;
  abrirDetalles(factura: Factura) {
    this.facturaSeleccionada = factura;
  }
  cerrarDetalles() {
    this.facturaSeleccionada = null;
  }

  // Calcula los días restantes para el vencimiento de una factura (8 días desde la fecha)
  getDiasRestantes(factura: Factura): number | null {
    if (!factura.fecha) return null;
    const fechaEmision = new Date(factura.fecha);
    const hoy = new Date();
    const diffMs = hoy.getTime() - fechaEmision.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return 8 - diffDias;
  }

  constructor(private route: ActivatedRoute) {
    // Leer query param para mostrar facturas por vencer
    this.route.queryParams.subscribe(params => {
      if (params['porVencer'] === 'true') {
        this.mostrarPorVencer = true;
        this.categoriaSeleccionada = null;
      }
    });
  }
}