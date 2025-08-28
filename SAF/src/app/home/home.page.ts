import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { AlertasService } from '../services/alertas.service';
import { Alerta } from '../models/alerta.model';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge, IonIcon, IonButtons, IonButton, IonGrid, IonRow, IonCol, IonRefresher, IonRefresherContent, IonList, IonItem, IonLabel
} from '@ionic/angular/standalone';
import { Factura } from '../models/factura.model';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FacturasPorEstadoChartComponent } from './facturas-por-estado-chart.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
  CommonModule, NgIf, NgFor,
  IonHeader, IonToolbar, IonTitle, IonContent, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge, IonIcon, IonButtons, IonButton, IonGrid, IonRow, IonCol, IonRefresher, IonRefresherContent, IonList, IonItem, IonLabel
  ],
})
export class HomePage implements OnInit {
  facturas: Factura[] = [];
  facturasPorVencer: any[] = [];
  alertasPendientes: Alerta[] = [];
  usuarioActual: string = 'usuario1';
  totalRecibidas = 0;
  totalPendientes = 0;
  totalRechazadas = 0;
  totalAceptadas = 0;
  totalVencidas = 0;
  totalPorVencer = 0;
  cargando = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private databaseService: DatabaseService,
    private loadingController: LoadingController,
    private alertasService: AlertasService
  ) {}

  get datosGraficaPorEstado() {
    return {
      Pendiente: this.totalPendientes,
      Aceptada: this.totalAceptadas,
      Rechazada: this.totalRechazadas,
      Vencida: this.totalVencidas,
      'Por vencer': this.totalPorVencer
    };
  }

  irAFacturasConFiltro(estado: string) {
    if (estado === 'PorVencer') {
      this.router.navigate(['/invoices'], { queryParams: { porVencer: 'true' } });
    } else if (estado) {
      this.router.navigate(['/invoices'], { queryParams: { estado } });
    } else {
      this.router.navigate(['/invoices']);
    }
  }

  async ngOnInit() {
    await this.cargarFacturasReales();
    this.calcularTotales();
    this.mostrarAlertasFacturasPorVencer();
  }

  async cargarFacturasReales() {
    const facturasDB = await this.databaseService.getFacturas();
    this.facturas = facturasDB.map(f => ({
      id: f.id,
      folio: f.folio,
      fechaRecepcion: f.fechaRecepcion || f.fecha_recepcion || '',
      fecha_recepcion: f.fecha_recepcion || f.fechaRecepcion || '',
      proveedor: f.proveedor,
      monto: f.monto,
      tipo: f.tipo || '',
      estado: f.estado || '',
      responsable: f.responsable || 'usuario1',
      comentario: f.comentario || '',
      diasDesdeRecepcion: f.diasDesdeRecepcion || 0,
      mensajeAlerta: f.mensajeAlerta || ''
    })) as Factura[];
    this.alertasService.generarAlertasPorFacturas(this.facturas);
  }

  calcularTotales() {
    this.totalRecibidas = this.facturas.length;
    this.totalPendientes = this.facturas.filter(f => (f.estado || '').toLowerCase() === 'pendiente').length;
    this.totalAceptadas = this.facturas.filter(f => (f.estado || '').toLowerCase() === 'aceptada').length;
    this.totalRechazadas = this.facturas.filter(f => (f.estado || '').toLowerCase() === 'rechazada').length;
    this.totalVencidas = this.facturas.filter(f => (f.estado || '').toLowerCase() === 'vencida').length;
    this.facturasPorVencer = this.facturas
      .filter(f => (f.estado || '').toLowerCase() === 'pendiente')
      .map(f => {
        const dias = this.diasRestantes(f.fechaRecepcion);
        return { ...f, diasRestantes: dias };
      })
      .filter(f => f.diasRestantes <= 2 && f.diasRestantes > 0);
    this.totalPorVencer = this.facturasPorVencer.length;
  }

  diasRestantes(fechaRecepcion: string): number {
    const fechaInicio = new Date(fechaRecepcion);
    const hoy = new Date();
    const diffMs = hoy.getTime() - fechaInicio.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return 8 - diffDias;
  }

  async mostrarAlertasFacturasPorVencer() {
    const facturasPorVencer = this.facturas
      .filter(f => (f.estado || '').toLowerCase() === 'pendiente')
      .map(f => {
        const dias = this.diasRestantes(f.fechaRecepcion);
        return { ...f, diasRestantes: dias };
      })
      .filter(f => f.diasRestantes <= 2 && f.diasRestantes > 0);

    if (facturasPorVencer.length > 0) {
      const audio = new Audio('assets/beep.mp3');
      audio.play().catch(e => console.warn('No se pudo reproducir el sonido de alerta:', e));
    }
  }

  async refrescar(event: any) {
    await this.cargarFacturasReales();
    this.calcularTotales();
    this.mostrarAlertasFacturasPorVencer();
    event.target.complete();
  }
}