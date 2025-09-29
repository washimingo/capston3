import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, AlertController, LoadingController, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonList, IonItem, IonLabel, IonButton, IonRefresher, IonRefresherContent, IonGrid, IonRow, IonCol, IonIcon, IonBadge } from '@ionic/angular/standalone';
import { Factura } from 'src/app/models/factura.model';
import { Db } from 'src/app/services/Database/db';
import { Alertas } from 'src/app/services/alerta/alertas';
import { Alerta } from 'src/app/models/alerta.model';
import { addIcons } from 'ionicons';
import {
  documentTextOutline,
  timeOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  warningOutline,
  alertCircleOutline,
  eyeOutline,
  listOutline,
  chevronForwardOutline,
  notificationsOutline,
  alertOutline,
  analyticsOutline,
  documentAttachOutline,
  settingsOutline
} from 'ionicons/icons';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    IonContent, 
    IonCard, 
    IonCardContent, 
    IonCardHeader, 
    IonCardTitle, 
    IonButton, 
    IonRefresher, 
    IonRefresherContent, 
    IonIcon, 
    IonBadge,
    HeaderComponent,
  ]
})
export class HomePage implements OnInit {
  // Función robusta para obtener el valor de la factura según el header (igual que invoices)
  getValorFactura(factura: any, header: string): any {
    if (!factura || !header) return '';
    if (factura[header] !== undefined && factura[header] !== null && factura[header] !== '') return factura[header];
    const lower = header.toLowerCase();
    if (factura[lower] !== undefined && factura[lower] !== null && factura[lower] !== '') return factura[lower];
    const noSpaces = header.replace(/\s+/g, '');
    if (factura[noSpaces] !== undefined && factura[noSpaces] !== null && factura[noSpaces] !== '') return factura[noSpaces];
    return '';
  }

  async verFactura(factura: any) {
    const detalles = [
      { label: 'Folio', key: 'Folio' },
      { label: 'Proveedor', key: 'proveedor' },
      { label: 'RUT Emisor', key: 'RUT Emisor' },
      { label: 'Fecha recepción', key: 'Fecha Recep.' },
      { label: 'Monto', key: 'Monto Total' },
      { label: 'Estado', key: 'estado' },
      { label: 'Días restantes', key: 'diasRestantes' }
    ];
    let msg = detalles
      .map(d => {
        const valor = this.getValorFactura(factura, d.key);
        if (valor === undefined || valor === null || valor === '') return '';
        return `${d.label}: ${valor}`;
      })
      .filter(linea => linea)
      .join('\n');
    const alert = await this.alertController.create({
      header: 'Detalle de factura',
      message: msg,
      buttons: ['Cerrar'],
      cssClass: 'factura-alert',
      mode: 'md',
    });
    await alert.present();
  }
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
    private databaseService: Db,
    private loadingController: LoadingController,
    private alertasService: Alertas
  ) {
    // Registrar iconos de Ionic
    addIcons({
      documentTextOutline,
      timeOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      warningOutline,
      alertCircleOutline,
      eyeOutline,
      listOutline,
      chevronForwardOutline,
      notificationsOutline,
      alertOutline,
      analyticsOutline,
      documentAttachOutline,
      settingsOutline
    });
  }

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
    // Leer primero desde localStorage (facturas importadas por CSV)
    const facturasGuardadas = localStorage.getItem('facturasCSV');
    if (facturasGuardadas) {
      this.facturas = JSON.parse(facturasGuardadas);
    } else {
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
        mensajeAlerta: f.mensajeAlerta || '',
        detalles: f.detalles || ''
      })) as Factura[];
    }
    this.alertasService.generarAlertasPorFacturas(this.facturas);
    this.calcularTotales();
    this.mostrarAlertasFacturasPorVencer();
  }

  calcularTotales() {
    this.totalRecibidas = this.facturas.length;
    this.totalPendientes = this.facturas.filter(f => (f.estado || '').toLowerCase() === 'pendiente').length;
    this.totalAceptadas = this.facturas.filter(f => (f.estado || '').toLowerCase() === 'aceptada').length;
    this.totalRechazadas = this.facturas.filter(f => (f.estado || '').toLowerCase() === 'rechazada').length;
    this.totalVencidas = this.facturas.filter(f => (f.estado || '').toLowerCase() === 'vencida').length;
    // Facturas por vencer: pendientes, a 2 días o menos de cumplir los 8 días desde emisión
    this.facturasPorVencer = this.facturas
      .filter(f => (f.estado || '').toLowerCase() === 'pendiente')
      .map(f => {
        // Usar fechaRecepcion como fecha de emisión para el cálculo
        const fechaEmision = f.fechaRecepcion;
        const diasRestantes = this.diasRestantesPorVencer(fechaEmision);
        return { ...f, fechaEmision, diasRestantes };
      })
      .filter(f => f.diasRestantes <= 2 && f.diasRestantes > 0);
    this.totalPorVencer = this.facturasPorVencer.length;
  }

  circunferencia = 2 * Math.PI * 16;

  get porcentajePendientes() {
    return this.totalRecibidas ? (this.totalPendientes / this.totalRecibidas) * 100 : 0;
  }
  get porcentajeAceptadas() {
    return this.totalRecibidas ? (this.totalAceptadas / this.totalRecibidas) * 100 : 0;
  }
  get porcentajeRechazadas() {
    return this.totalRecibidas ? (this.totalRechazadas / this.totalRecibidas) * 100 : 0;
  }
  get porcentajePorVencer() {
    return this.totalRecibidas ? (this.totalPorVencer / this.totalRecibidas) * 100 : 0;
  }

  // Segmentos para el donut
  get circPendientes() {
    return (this.porcentajePendientes / 100) * this.circunferencia;
  }
  get circAceptadas() {
    return (this.porcentajeAceptadas / 100) * this.circunferencia;
  }
  get circRechazadas() {
    return (this.porcentajeRechazadas / 100) * this.circunferencia;
  }
  get circPorVencer() {
    return (this.porcentajePorVencer / 100) * this.circunferencia;
  }

  // Offsets para que los segmentos no se superpongan
  get offsetPendientes() {
    return 0;
  }
  get offsetAceptadas() {
    return this.circPendientes;
  }
  get offsetRechazadas() {
    return this.circPendientes + this.circAceptadas;
  }
  get offsetPorVencer() {
    return this.circPendientes + this.circAceptadas + this.circRechazadas;
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
    event.target.complete();
  }

  // Calcula días restantes para pasar a vencida (8 días desde emisión)
  diasRestantesPorVencer(fechaEmision: string): number {
    if (!fechaEmision) return 0;
    let partes = fechaEmision.split('-');
    let anio, mes, dia;
    if (partes[0].length === 4) {
      anio = parseInt(partes[0], 10);
      mes = parseInt(partes[1], 10) - 1;
      dia = parseInt(partes[2], 10);
    } else {
      dia = parseInt(partes[0], 10);
      mes = parseInt(partes[1], 10) - 1;
      anio = parseInt(partes[2], 10);
    }
    const fecha = new Date(anio, mes, dia);
    const hoy = new Date();
    const diffMs = hoy.getTime() - fecha.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return 8 - diffDias;
  }
}