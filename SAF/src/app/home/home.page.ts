import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import {
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonMenuButton, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent, 
  IonBadge, 
  IonIcon, 
  IonButtons, 
  IonButton, 
  IonGrid, 
  IonRow, 
  IonCol
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

interface Factura {
  id: string;
  folio: string;
  proveedor: string;
  fecha_recepcion: string;
  monto: number;
  estado: 'Recibida' | 'Aceptada' | 'Rechazada' | 'Vencida' | 'Aceptada tácita';
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, 
    IonToolbar, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonMenuButton, 
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonIcon,
  IonButtons,
  IonButton,
  IonGrid,
  IonRow,
  IonCol
  ],
})
export class HomePage implements OnInit {
  facturas: Factura[] = [];

  totalRecibidas = 0;
  totalPendientes = 0;
  totalRechazadas = 0;
  totalAceptadas = 0;
  totalVencidas = 0;
  totalPorVencer = 0;


  constructor(private router: Router, private alertController: AlertController) {}

  ngOnInit() {
    this.facturas = this.generarFacturasSimuladas();
    this.calcularTotales();
    this.mostrarAlertasFacturasPorVencer();
  }

  generarFacturasSimuladas(): Factura[] {
    return [
      { id: '1', folio: 'F001', proveedor: 'Proveedor A', fecha_recepcion: '2025-08-18', monto: 120000, estado: 'Recibida' },
      { id: '2', folio: 'F002', proveedor: 'Proveedor B', fecha_recepcion: '2025-08-20', monto: 110000, estado: 'Recibida' },
      { id: '3', folio: 'F003', proveedor: 'Proveedor C', fecha_recepcion: '2025-08-22', monto: 130000, estado: 'Recibida' },
      { id: '4', folio: 'F004', proveedor: 'Proveedor D', fecha_recepcion: '2025-08-04', monto: 100000, estado: 'Aceptada' },
      { id: '5', folio: 'F005', proveedor: 'Proveedor E', fecha_recepcion: '2025-08-05', monto: 140000, estado: 'Rechazada' },
      { id: '6', folio: 'F006', proveedor: 'Proveedor F', fecha_recepcion: '2025-08-06', monto: 90000, estado: 'Vencida' },
      { id: '7', folio: 'F007', proveedor: 'Proveedor G', fecha_recepcion: '2025-08-07', monto: 125000, estado: 'Recibida' },
      { id: '8', folio: 'F008', proveedor: 'Proveedor H', fecha_recepcion: '2025-08-08', monto: 117000, estado: 'Recibida' },
      { id: '9', folio: 'F009', proveedor: 'Proveedor I', fecha_recepcion: '2025-08-09', monto: 98000, estado: 'Aceptada tácita' },
      { id: '10', folio: 'F010', proveedor: 'Proveedor J', fecha_recepcion: '2025-08-10', monto: 76000, estado: 'Recibida' },
      { id: '11', folio: 'F011', proveedor: 'Proveedor K', fecha_recepcion: '2025-08-11', monto: 119000, estado: 'Rechazada' },
      { id: '12', folio: 'F012', proveedor: 'Proveedor L', fecha_recepcion: '2025-08-12', monto: 99000, estado: 'Recibida' },
      { id: '13', folio: 'F013', proveedor: 'Proveedor M', fecha_recepcion: '2025-08-13', monto: 115000, estado: 'Aceptada' },
      { id: '14', folio: 'F014', proveedor: 'Proveedor N', fecha_recepcion: '2025-08-14', monto: 125000, estado: 'Recibida' },
      { id: '15', folio: 'F015', proveedor: 'Proveedor O', fecha_recepcion: '2025-08-15', monto: 135000, estado: 'Vencida' },
      { id: '16', folio: 'F016', proveedor: 'Proveedor P', fecha_recepcion: '2025-08-16', monto: 107000, estado: 'Aceptada tácita' },
      { id: '17', folio: 'F017', proveedor: 'Proveedor Q', fecha_recepcion: '2025-08-17', monto: 97000, estado: 'Recibida' },
      { id: '18', folio: 'F018', proveedor: 'Proveedor R', fecha_recepcion: '2025-08-18', monto: 111000, estado: 'Recibida' },
      { id: '19', folio: 'F019', proveedor: 'Proveedor S', fecha_recepcion: '2025-08-19', monto: 123000, estado: 'Rechazada' },
      { id: '20', folio: 'F020', proveedor: 'Proveedor T', fecha_recepcion: '2025-08-20', monto: 109000, estado: 'Aceptada' }
    ];
  }

  calcularTotales() {
    this.totalRecibidas = this.facturas.length;
    this.totalPendientes = this.facturas.filter(f => f.estado === 'Recibida').length;
    this.totalRechazadas = this.facturas.filter(f => f.estado === 'Rechazada').length;
    this.totalAceptadas = this.facturas.filter(f => f.estado === 'Aceptada' || f.estado === 'Aceptada tácita').length;
    this.totalVencidas = this.facturas.filter(f => f.estado === 'Vencida').length;
    this.totalPorVencer = this.facturas
      .filter(f => f.estado === 'Recibida')
      .map(f => this.diasRestantes(f.fecha_recepcion))
      .filter(dias => dias <= 2 && dias > 0).length;
  }

  irAFacturasConFiltro(estado: string) {
    if (estado === 'PorVencer') {
      this.router.navigate(['/invoices'], { queryParams: { porVencer: 'true' } });
    } else {
      this.router.navigate(['/invoices'], { queryParams: { estado } });
    }
  }

  // mostrarDetalleFacturasPorVencer eliminado, ahora la lógica de filtrado irá en la vista de facturas

  diasRestantes(fechaRecepcion: string): number {
    const fechaInicio = new Date(fechaRecepcion);
    const hoy = new Date();
    const diffMs = hoy.getTime() - fechaInicio.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return 8 - diffDias;
  } 

  async mostrarAlertasFacturasPorVencer() {
    const facturasPorVencer = this.facturas
      .filter(f => f.estado === 'Recibida')
      .map(f => {
        const dias = this.diasRestantes(f.fecha_recepcion);
        return { ...f, diasRestantes: dias };
      })
      .filter(f => f.diasRestantes <= 2 && f.diasRestantes > 0);

    if (facturasPorVencer.length > 0) {
      let mensaje = '';
      facturasPorVencer.forEach(f => {
        mensaje += `Factura ${f.folio} de ${f.proveedor}: ¡Te quedan ${f.diasRestantes} día(s) para que venza!` + '\n';
      });
      const alert = await this.alertController.create({
        header: 'Facturas por vencer',
        message: mensaje,
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}