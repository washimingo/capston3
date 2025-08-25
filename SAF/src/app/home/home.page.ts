import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
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
  facturasPorVencer: any[] = [];

  totalRecibidas = 0;
  totalPendientes = 0;
  totalRechazadas = 0;
  totalAceptadas = 0;
  totalVencidas = 0;
  totalPorVencer = 0;


  constructor(
    private router: Router,
    private alertController: AlertController,
    private databaseService: DatabaseService
  ) {}

  async ngOnInit() {
    await this.cargarFacturasReales();
    this.calcularTotales();
    this.mostrarAlertasFacturasPorVencer();
  }

  async cargarFacturasReales() {
    this.facturas = await this.databaseService.getFacturas();
  }

  // Eliminar datos simulados. Ahora se usan facturas reales desde la base de datos.

  calcularTotales() {
    this.totalRecibidas = this.facturas.length;
    this.totalPendientes = this.facturas.filter(f => (f.estado || '').toLowerCase() === 'pendiente').length;
    this.totalAceptadas = this.facturas.filter(f => (f.estado || '').toLowerCase() === 'aceptada').length;
    this.totalRechazadas = this.facturas.filter(f => (f.estado || '').toLowerCase() === 'rechazada').length;
    this.totalVencidas = this.facturas.filter(f => (f.estado || '').toLowerCase() === 'vencida').length;
    this.facturasPorVencer = this.facturas
      .filter(f => (f.estado || '').toLowerCase() === 'pendiente')
      .map(f => {
        // Soporta ambos campos: fecha_recepcion y fechaRecepcion
        const dias = this.diasRestantes(f.fecha_recepcion || (f as any).fechaRecepcion);
        return { ...f, diasRestantes: dias };
      })
      .filter(f => f.diasRestantes <= 2 && f.diasRestantes > 0);
    this.totalPorVencer = this.facturasPorVencer.length;
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