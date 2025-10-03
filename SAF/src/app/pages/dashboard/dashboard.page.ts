import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { 
  IonContent, 
  IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonIcon, IonHeader, IonToolbar, IonButtons } from '@ionic/angular/standalone';
import { Chart, registerables } from 'chart.js';
import { Db } from 'src/app/services/Database/db';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { addIcons } from 'ionicons';
import {
  refreshOutline,
  alarmOutline,
  documentTextOutline,
  cashOutline,
  calendarOutline,
  pieChartOutline,
  expandOutline,
  contractOutline,
  trophyOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  filterOutline,
  eyeOutline,
  checkmarkOutline,
  warningOutline,
  arrowForwardOutline, 
  listOutline, 
  businessOutline, 
  funnelOutline, 
  downloadOutline, 
  swapVerticalOutline,
  analyticsOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [  
    CommonModule, FormsModule, RouterModule, 
    IonContent, IonCard, IonCardHeader, IonCardTitle, 
    IonCardContent, IonButton, IonIcon, HeaderComponent
  ]
})
export class DashboardPage implements OnInit {
  @ViewChild('pieChartCanvas', { static: false }) pieChartCanvas!: ElementRef;
  @ViewChild('barChartCanvas', { static: false }) barChartCanvas!: ElementRef;
  @ViewChild('lineChartCanvas', { static: false }) lineChartCanvas!: ElementRef;
  
  pieChart: any;
  barChart: any;
  lineChart: any;
  
  facturas: any[] = [];
  proveedores: string[] = [];
  montosPorProveedor: number[] = [];
  meses: string[] = [];
  cantidadPorMes: number[] = [];
  montoPorMes: number[] = [];
  
  // Nuevas propiedades para funcionalidad mejorada
  mostrarDetallesRuts: boolean = false;
  vistaDetallada: boolean = true;
  ordenActual: string = 'monto';
  
  // Busca el primer campo que parezca un RUT en la factura
  getRutFromFactura(f: any): string {
    const posibles = [
      'rutEmisor', 'rut', 'rutProveedor', 'rut_proveedor', 'RUT', 'RUTEmisor', 'RUTProveedor', 'emisorRUT', 'emisorRut', 'rut_emisor', 'rut_emisor_factura'
    ];
    for (const campo of posibles) {
      if (f[campo]) return f[campo];
    }
    // Si no encuentra, busca un campo cuyo valor tenga formato de RUT chileno
    for (const key of Object.keys(f)) {
      if (typeof f[key] === 'string' && /^[0-9]{7,8}-[0-9kK]$/.test(f[key])) {
        return f[key];
      }
    }
    return '-';
  }
  getFacturasPorVencerManianaNoRevisadas(): any[] {
    const hoy = new Date();
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);
    const mananaStr = manana.toISOString().slice(0, 10);
    return this.facturas.filter(f => {
      const fechaRecepcion = (f.fechaRecepcion || f.fecha || '').slice(0, 10);
      if (!fechaRecepcion) return false;
      const fechaVencimiento = new Date(fechaRecepcion);
      fechaVencimiento.setDate(fechaVencimiento.getDate() + 8);
      const venceManiana = fechaVencimiento.toISOString().slice(0, 10) === mananaStr;
      const noRevisada = !f.revisada && (f.estado !== 'Revisada');
      return venceManiana && noRevisada;
    });
  }
  getMontoTotalFacturacion(): number {
    return this.montoPorMes.reduce((acc, monto) => acc + monto, 0);
  }
  showAlertaPorVencer: boolean = true;
  // Indicadores para dashboard
  getFacturasPorVencerHoy(): any[] {
    const hoy = new Date();
    const hoyStr = hoy.toISOString().slice(0, 10);
    return this.facturas.filter(f => {
      const fechaRecepcion = (f.fechaRecepcion || f.fecha || '').slice(0, 10);
      if (!fechaRecepcion) return false;
      const fechaVencimiento = new Date(fechaRecepcion);
      fechaVencimiento.setDate(fechaVencimiento.getDate() + 8);
      return fechaVencimiento.toISOString().slice(0, 10) === hoyStr;
    });
  }

  getMontoPorVencerHoy(): number {
    return this.getFacturasPorVencerHoy().reduce((acc, f) => acc + (f['Monto Total'] || f.monto || 0), 0);
  }

  getRankingProveedoresPorVencerHoy(): { proveedor: string, cantidad: number }[] {
    const porVencer = this.getFacturasPorVencerHoy();
    const resumen: { [proveedor: string]: number } = {};
    porVencer.forEach(f => {
      const proveedor = f.proveedor || 'Sin proveedor';
      resumen[proveedor] = (resumen[proveedor] || 0) + 1;
    });
    return Object.entries(resumen)
      .map(([proveedor, cantidad]) => ({ proveedor, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }

  getAlertaPorVencerHoy(): string {
    const cantidad = this.getFacturasPorVencerHoy().length;
    if (cantidad === 0) return 'No tienes facturas por vencer hoy.';
    if (cantidad === 1) return '¡Tienes 1 factura que vence hoy!';
    return `¡Tienes ${cantidad} facturas que vencen hoy!`;
  }
  archivoCSV: string = '';
  contenidoCSV: string = '';
  // Cuenta las facturas por vencer (próximos 7 días)
  getFacturasPorVencerCount(): number {
    return this.facturas.filter(f => this.esPorVencer(f['Fecha Docto.'] || f.fechaEmision || '')).length;
  }

  // Lógica para determinar si una factura está por vencer (igual que en invoices)
  esPorVencer(fechaDocto: string): boolean {
    if (!fechaDocto) return false;
    // Formato esperado: dd-mm-yyyy
    const partes = fechaDocto.split('-');
    if (partes.length !== 3) return false;
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1;
    const anio = parseInt(partes[2], 10);
    const fechaFactura = new Date(anio, mes, dia);
    const hoy = new Date();
    const diferencia = (fechaFactura.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);
    return diferencia >= 0 && diferencia <= 7;
  } 
  constructor(private dbService: Db) {
    // Registrar componentes de Chart.js
    Chart.register(...registerables);
    
    // Registrar todos los iconos de Ionic
    addIcons({
      refreshOutline,
      alarmOutline,
      documentTextOutline,
      cashOutline,
      calendarOutline,
      pieChartOutline,
      listOutline,
      businessOutline,
      funnelOutline,
      downloadOutline,
      swapVerticalOutline,
      eyeOutline,
      filterOutline,
      trophyOutline,
      checkmarkCircleOutline,
      alertCircleOutline,
      checkmarkOutline,
      warningOutline,
      arrowForwardOutline,
      expandOutline,
      contractOutline,
      analyticsOutline
    });
  }

  async ngOnInit() {
    console.log('=== Dashboard ngOnInit ===');
    
    // Leer facturas desde localStorage si existen
    const facturasGuardadas = localStorage.getItem('facturasCSV');
    if (facturasGuardadas) {
      this.facturas = JSON.parse(facturasGuardadas);
      console.log('Facturas cargadas desde localStorage:', this.facturas.length);
      // Leer nombre y contenido del archivo CSV
      this.archivoCSV = localStorage.getItem('archivoCSV') || '';
      this.contenidoCSV = localStorage.getItem('contenidoCSV') || '';
    } else {
      this.facturas = await this.dbService.getFacturas();
      console.log('Facturas cargadas desde base de datos:', this.facturas.length);
    }
    
    // Calcular datos para gráficos
    this.calcularMontosPorProveedor();
    this.calcularEvolucionMensual();
    
    // Mostrar alerta solo si hay facturas por vencer hoy
    this.showAlertaPorVencer = this.getFacturasPorVencerHoy().length > 0;
    
    console.log('Datos procesados - Proveedores:', this.proveedores.length, 'Montos:', this.montosPorProveedor.length);
  }

  ngAfterViewInit() {
    // Esperar un poco para que el DOM se renderice completamente
    setTimeout(() => {
      console.log('ngAfterViewInit - Canvas disponible:', !!this.pieChartCanvas?.nativeElement);
      console.log('Datos disponibles - Proveedores:', this.proveedores.length, 'Montos:', this.montosPorProveedor.length);
      
      // Si ya hay datos cargados, renderizar el gráfico de torta
      if (this.proveedores.length > 0 && this.montosPorProveedor.length > 0) {
        this.generarGraficoTorta();
      } else {
        // Si no hay datos, intentar cargarlos y luego generar el gráfico
        this.cargarDatosYGenerarGrafico();
      }
    }, 500);
  }

  async cargarDatosYGenerarGrafico() {
    if (this.facturas.length === 0) {
      // Intentar cargar datos si no existen
      const facturasGuardadas = localStorage.getItem('facturasCSV');
      if (facturasGuardadas) {
        this.facturas = JSON.parse(facturasGuardadas);
      } else {
        this.facturas = await this.dbService.getFacturas();
      }
    }
    
    if (this.facturas.length > 0) {
      this.calcularMontosPorProveedor();
      this.calcularEvolucionMensual();
      
      // Generar gráfico después de procesar los datos
      setTimeout(() => {
        this.generarGraficoTorta();
      }, 100);
    }
  }

  generarGraficoTorta(): void {
    console.log('=== Generando gráfico de torta ===');
    console.log('Canvas disponible:', !!this.pieChartCanvas?.nativeElement);
    console.log('Proveedores:', this.proveedores);
    console.log('Montos por proveedor:', this.montosPorProveedor);
    
    // Verificar que el canvas esté disponible
    if (!this.pieChartCanvas || !this.pieChartCanvas.nativeElement) {
      console.error('El canvas de la gráfica de torta no está disponible');
      return;
    }
    
    // Verificar que haya datos
    if (!this.proveedores.length || !this.montosPorProveedor.length) {
      console.warn('No hay datos para el gráfico de torta');
      // Crear datos de ejemplo para mostrar algo
      this.proveedores = ['Sin datos'];
      this.montosPorProveedor = [1];
    }
    
    // Destruir gráfico anterior si existe
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    
    try {
      const canvas = this.pieChartCanvas.nativeElement;
      console.log('Canvas context:', canvas.getContext('2d'));
      
      this.pieChart = new Chart(canvas, {
        type: 'pie',
        data: {
          labels: this.proveedores,
          datasets: [
            {
              label: 'Monto por proveedor',
              data: this.montosPorProveedor,
              backgroundColor: [
                '#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', 
                '#F44336', '#8BC34A', '#FFC107', '#00BCD4', '#E91E63'
              ],
              borderColor: [
                '#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', 
                '#F44336', '#8BC34A', '#FFC107', '#00BCD4', '#E91E63'
              ],
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { 
              display: true, 
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true
              }
            },
            title: { 
              display: true, 
              text: 'Distribución de montos por proveedor',
              font: {
                size: 16,
                weight: 'bold'
              },
              padding: 20
            }
          },
          layout: {
            padding: 10
          }
        }
      });
      
      console.log('Gráfico creado exitosamente:', this.pieChart);
      
    } catch (e) {
      console.error('Error al crear el gráfico de torta:', e);
    }
  }

  calcularMontosPorProveedor(): void {
    const resumen: { [proveedor: string]: number } = {};
    this.facturas.forEach(f => {
      // Buscar el monto usando alternativas
      const monto = f['Monto Total'] || f.monto || f.total || f['Monto Neto'] || 0;
      // Buscar el proveedor usando alternativas
      const proveedor = f.proveedor || f['RUT Emisor'] || f.razonSocial || f.cliente || 'Sin proveedor';
      resumen[proveedor] = (resumen[proveedor] || 0) + Number(monto);
    });
    this.proveedores = Object.keys(resumen);
    this.montosPorProveedor = Object.values(resumen);
  }

  calcularEvolucionMensual(): void {
    const resumenMeses: { [mes: string]: { cantidad: number, monto: number } } = {};
    this.facturas.forEach(f => {
      const fecha = f.fechaRecepcion || f.fecha || f.fecha_recepcion || '';
      if (!fecha) return;
      const mes = fecha.slice(0, 7); // yyyy-MM
      if (!resumenMeses[mes]) resumenMeses[mes] = { cantidad: 0, monto: 0 };
      resumenMeses[mes].cantidad += 1;
      resumenMeses[mes].monto += Number(f.monto) || 0;
    });
    this.meses = Object.keys(resumenMeses).sort();
    this.cantidadPorMes = this.meses.map(m => resumenMeses[m].cantidad);
    this.montoPorMes = this.meses.map(m => resumenMeses[m].monto);
  }

  generarGraficoBarra(): void {
    if (this.barChart) {
      this.barChart.destroy();
    }
    this.barChart = new Chart(this.barChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.proveedores,
        datasets: [{
          label: 'Monto por proveedor',
          data: this.montosPorProveedor,
          backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Montos por proveedor' }
        }
      }
    });
  }

  generarGraficoLinea(): void {
    if (this.lineChart) {
      this.lineChart.destroy();
    }
    this.lineChart = new Chart(this.lineChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.meses,
        datasets: [
          {
            label: 'Cantidad de facturas',
            data: this.cantidadPorMes,
            borderColor: '#36A2EB',
            backgroundColor: 'rgba(61,194,255,0.2)',
            fill: true,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: '#36A2EB',
          },
          {
            label: 'Monto total',
            data: this.montoPorMes,
            borderColor: '#FF6384',
            backgroundColor: 'rgba(255,99,132,0.2)',
            fill: true,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: '#FF6384',
            yAxisID: 'y2',
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: { display: true, text: 'Evolución mensual de facturación' }
        },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Cantidad' } },
          y2: {
            beginAtZero: true,
            position: 'right',
            title: { display: true, text: 'Monto total' },
            grid: { drawOnChartArea: false },
            min: 0,
            max: Math.max(...this.montoPorMes, 100),
            ticks: {
              callback: function(value) {
                return '$' + value;
              }
            }
          }
        }
      }
    });
  }
  
  // ============ MÉTODOS PARA FUNCIONALIDAD MEJORADA ============
  
  toggleMostrarRuts(): void {
    this.mostrarDetallesRuts = !this.mostrarDetallesRuts;
  }
  
  toggleVisualizacion(): void {
    this.vistaDetallada = !this.vistaDetallada;
    // Regenerar gráfico con nuevo tamaño
    setTimeout(() => this.generarGraficoTorta(), 100);
  }
  
  getPromedioMontoProveedor(): number {
    if (this.proveedores.length === 0) return 0;
    return this.getMontoTotalFacturacion() / this.proveedores.length;
  }
  
  getTopProveedores(): { proveedor: string, monto: number }[] {
    return this.proveedores.map((proveedor, index) => ({
      proveedor,
      monto: this.montosPorProveedor[index]
    })).sort((a, b) => b.monto - a.monto);
  }
  
  getProveedoresDetallados(): any[] {
    const resumen: { [proveedor: string]: { nombre: string, rut: string, monto: number, cantidad: number, facturas: any[] } } = {};
    
    this.facturas.forEach(f => {
      const proveedor = f.proveedor || f.nombreProveedor || f.razonSocial || 'Sin proveedor';
      const monto = f['Monto Total'] || f.monto || f.total || 0;
      const rut = this.getRutFromFactura(f);
      
      if (!resumen[proveedor]) {
        resumen[proveedor] = {
          nombre: proveedor,
          rut: rut,
          monto: 0,
          cantidad: 0,
          facturas: []
        };
      }
      
      resumen[proveedor].monto += Number(monto);
      resumen[proveedor].cantidad += 1;
      resumen[proveedor].facturas.push(f);
    });
    
    let resultado = Object.values(resumen);
    
    // Ordenar según ordenActual
    switch (this.ordenActual) {
      case 'proveedor':
        resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'monto':
        resultado.sort((a, b) => b.monto - a.monto);
        break;
      case 'cantidad':
        resultado.sort((a, b) => b.cantidad - a.cantidad);
        break;
    }
    
    return resultado;
  }
  
  ordenarPor(campo: string): void {
    this.ordenActual = campo;
  }
  
  exportarProveedores(): void {
    const proveedores = this.getProveedoresDetallados();
    const csvContent = [
      'Proveedor,RUT,Cantidad Facturas,Monto Total',
      ...proveedores.map(p => `"${p.nombre}","${p.rut}","${p.cantidad}","${p.monto}"`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'proveedores_detalle.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  filtrarProveedores(): void {
    // Placeholder para modal de filtros
    console.log('Abrir modal de filtros');
  }
  
  verDetalleProveedor(proveedor: any): void {
    // Placeholder para modal de detalle
    console.log('Ver detalle de proveedor:', proveedor);
  }
  
  filtrarPorProveedor(proveedor: any): void {
    // Placeholder para filtrar por proveedor
    console.log('Filtrar por proveedor:', proveedor);
  }

  onHeaderButtonClick(action: string): void {
    switch(action) {
      case 'refresh':
        this.ngOnInit();
        break;
      default:
        console.log('Acción de botón no reconocida:', action);
    }
  }
}