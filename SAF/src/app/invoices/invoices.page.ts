

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
  IonCardHeader,
  IonCardTitle,
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

interface BitacoraLog {
  usuario: string;
  accion: string;
  fecha: Date;
}

interface Factura {
  id: number;
  cliente: string;
  monto: number;
  estado: string; // Pendiente, Aceptada, Rechazada, Vencida
  fecha: string;
  detalles: string;
  archivo?: string;
  bitacora?: BitacoraLog[];
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
    IonCardHeader,
    IonCardTitle,
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
  archivoBase64: string | null = null;
  facturas: Factura[] = [
    { id: 1, cliente: 'Empresa A', monto: 1000, estado: 'Pendiente', fecha: '2025-08-17', detalles: 'Factura pendiente de pago.', bitacora: [ { usuario: 'admin', accion: 'Creación de factura', fecha: new Date('2025-08-17T10:00:00') } ] },
    { id: 2, cliente: 'Empresa B', monto: 2000, estado: 'Aceptada', fecha: '2025-07-15', detalles: 'Factura aceptada y pagada.', bitacora: [ { usuario: 'admin', accion: 'Creación de factura', fecha: new Date('2025-07-15T09:00:00') }, { usuario: 'jefe', accion: 'Aceptada', fecha: new Date('2025-07-16T12:00:00') } ] },
    { id: 3, cliente: 'Empresa C', monto: 1500, estado: 'Rechazada', fecha: '2025-08-17', detalles: 'Factura rechazada por error.', bitacora: [ { usuario: 'admin', accion: 'Creación de factura', fecha: new Date('2025-08-17T11:00:00') }, { usuario: 'auditor', accion: 'Rechazada', fecha: new Date('2025-08-18T14:00:00') } ] },
    { id: 4, cliente: 'Empresa D', monto: 1800, estado: 'Pendiente', fecha: '2025-08-17', detalles: 'Factura vencida, no pagada.', bitacora: [ { usuario: 'admin', accion: 'Creación de factura', fecha: new Date('2025-08-17T13:00:00') } ] },
    { id: 5, cliente: 'Empresa E', monto: 1200, estado: 'Pendiente', fecha: '2025-08-10', detalles: 'Factura pendiente de pago.', bitacora: [ { usuario: 'admin', accion: 'Creación de factura', fecha: new Date('2025-08-10T08:00:00') } ] },
    // ...puedes agregar más facturas aquí...
  ];
  // Carga manual de facturas
  nuevaFactura: Partial<Factura> = { cliente: '', monto: undefined, detalles: '' };
  archivoSeleccionado: File | null = null;
  errorCarga: string = '';
  exitoCarga: string = '';

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'xml', 'jpg', 'jpeg', 'png'].includes(ext)) {
      this.errorCarga = 'Solo se permiten archivos PDF, XML o imágenes.';
      this.exitoCarga = '';
      this.archivoSeleccionado = null;
      return;
    }
  this.archivoSeleccionado = file;
  this.errorCarga = '';
  }

  onSubmitFactura(event: Event) {
    event.preventDefault();
    this.errorCarga = '';
    this.exitoCarga = '';
    if (!this.archivoSeleccionado) {
      this.errorCarga = 'Debe seleccionar un archivo válido.';
      return;
    }
    if (!this.nuevaFactura.cliente || !this.nuevaFactura.monto) {
      this.errorCarga = 'Debe completar los campos obligatorios.';
      return;
    }
    // Simular guardado (en memoria)
    const reader = new FileReader();
    reader.onload = () => {
      this.archivoBase64 = reader.result as string;
      const id = this.facturas.length + 1;
      const nueva: Factura = {
        id,
        cliente: this.nuevaFactura.cliente!,
        monto: this.nuevaFactura.monto!,
        estado: 'Pendiente',
        fecha: new Date().toISOString().slice(0, 10),
        detalles: this.nuevaFactura.detalles || '',
        archivo: this.archivoSeleccionado!.name,
        bitacora: [
          { usuario: 'usuario demo', accion: 'Carga manual de factura', fecha: new Date() }
        ]
      };
      this.facturas.unshift(nueva);
      this.nuevaFactura = { cliente: '', monto: undefined, detalles: '' };
      this.archivoSeleccionado = null;
      this.exitoCarga = 'Factura cargada exitosamente.';
      setTimeout(() => this.exitoCarga = '', 2500);
    };
    reader.readAsDataURL(this.archivoSeleccionado);
  }

  // Devuelve una URL de objeto/base64 para visualizar el archivo adjunto (solo para facturas cargadas en la sesión actual)
  getFacturaFileUrl(factura: Factura): string | null {
    if (!factura.archivo) return null;
    // Si es la última factura cargada manualmente y hay base64, mostrarlo
    if (this.facturas[0] === factura && this.archivoBase64) {
      return this.archivoBase64;
    }
    // Si es una factura precargada, buscar en assets/facturas/
    // Solo para PDF, imágenes, etc.
    const ext = (factura.archivo.split('.').pop() || '').toLowerCase();
    if (['pdf', 'jpg', 'jpeg', 'png'].includes(ext)) {
      return `assets/facturas/${factura.archivo}`;
    }
    // Para XML u otros, solo mostrar el nombre
    return '';
  }

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