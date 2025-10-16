import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Db } from 'src/app/services/Database/db';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { addIcons } from 'ionicons';
import { 
  documentTextOutline, 
  cloudDownloadOutline, 
  analyticsOutline, 
  statsChartOutline,
  receiptOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  timeOutline,
  trendingUpOutline,
  printOutline,
  shareOutline,
  eyeOutline,
  downloadOutline,
  refreshOutline,
  barChartOutline,
  expandOutline,
  gridOutline,
  filterOutline,
  settingsOutline,
  closeCircleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonIcon, HeaderComponent]
})
export class ReportsPage implements OnInit {
  graficoExpandido: 'estado' | 'dia' | null = null;

  expandirGrafico(tipo: 'estado' | 'dia') {
    this.graficoExpandido = tipo;
    setTimeout(() => {
      if (tipo === 'estado') this.generarGrafico();
      if (tipo === 'dia') this.generarGraficoPorDia();
    }, 100);
  }

  contraerGrafico() {
    this.graficoExpandido = null;
    setTimeout(() => {
      this.generarGrafico();
      this.generarGraficoPorDia();
    }, 100);
  }
  // Importar los headers y función de invoices
  csvHeaders: string[] = [
    'Nro.',
    'RUT Emisor',
    'Folio',
    'Fecha Docto.',
    'Monto Neto',
    'Monto Exento',
    'Monto IVA',
    'Monto Total',
    'Fecha Recep.',
    'Evento Receptor',
    'Codigo Otro Impto',
    'Valor Otro Impto',
    'Tasa Otro Impto'
  ];

  getValorFactura(factura: any, header: string): any {
    if (!factura || !header) return '';
    if (factura[header] !== undefined && factura[header] !== null && factura[header] !== '') return factura[header];
    const lower = header.toLowerCase();
    if (factura[lower] !== undefined && factura[lower] !== null && factura[lower] !== '') return factura[lower];
    const noSpaces = header.replace(/\s+/g, '');
    if (factura[noSpaces] !== undefined && factura[noSpaces] !== null && factura[noSpaces] !== '') return factura[noSpaces];
    return '';
  }
  // Devuelve las facturas filtradas (por ahora todas, pero aquí puedes aplicar filtros activos)
  getFacturasFiltradas(): any[] {
    // Aquí puedes aplicar lógica de filtrado según los filtros activos en la UI
    // Por defecto retorna todas
    return this.facturas;
  }

  getPercentage(cantidad: number): string {
    const total = this.resumenEstados.reduce((sum, item) => sum + item.cantidad, 0);
    return total > 0 ? ((cantidad / total) * 100).toFixed(1) : '0';
  }
  async ngOnInit() {
    await this.cargarDatos();
  }
  @ViewChild('barChartCanvas', { static: false }) barChartCanvas!: ElementRef;
  chart: any;
  resumenEstados: { estado: string, cantidad: number }[] = [];
  facturas: any[] = [];
  resumenPorDia: { fecha: string, cantidad: number }[] = [];

  constructor(private db: Db, private router: Router) {
    // Registrar componentes de Chart.js
    Chart.register(...registerables);
    
    addIcons({
      'document-text-outline': documentTextOutline,
      'cloud-download-outline': cloudDownloadOutline,
      'analytics-outline': analyticsOutline,
      'stats-chart-outline': statsChartOutline,
      'receipt-outline': receiptOutline,
      'alert-circle-outline': alertCircleOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'time-outline': timeOutline,
      'trending-up-outline': trendingUpOutline,
      'print-outline': printOutline,
      'share-outline': shareOutline,
      'eye-outline': eyeOutline,
      'download-outline': downloadOutline,
      'document-outline': documentTextOutline,
      'grid-outline': gridOutline,
      'refresh-outline': refreshOutline,
      'bar-chart-outline': barChartOutline,
      'expand-outline': expandOutline,
      'filter-outline': filterOutline,
      'settings-outline': settingsOutline,
      'close-circle-outline': closeCircleOutline
    });
  }

  async ngAfterViewInit() {
    await this.cargarDatos();
    // Pequeño delay para asegurar que el DOM esté completamente renderizado
    setTimeout(() => {
      this.generarGrafico();
      this.generarGraficoPorDia();
    }, 100);
  }

  async cargarDatos() {
    // Leer primero desde localStorage (facturas importadas por CSV)
    const facturasGuardadas = localStorage.getItem('facturasCSV');
    if (facturasGuardadas) {
      this.facturas = JSON.parse(facturasGuardadas);
    } else {
      this.facturas = await this.db.getFacturas();
    }
    
    console.log('Facturas cargadas:', this.facturas.length);
    
    // Estados personalizados igual que invoices
    const estados = [
      'Pendiente',
      'Por Vencer',
      'Recibido',
      'Acuse Recibo',
      'Reclamado',
      'Rechazado',
      'Recibido con Aceptación Tácita'
    ];
    this.resumenEstados = estados.map(estado => {
      if (estado === 'Por Vencer') {
        // Facturas pendientes que están por vencer
        const hoy = new Date();
        const cantidad = this.facturas.filter(f => {
          if ((f.estado || '').toLowerCase() === 'pendiente') {
            const fechaEmision = f.fechaRecepcion || f.fecha || '';
            if (!fechaEmision) return false;
            const diffMs = hoy.getTime() - new Date(fechaEmision).getTime();
            const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const diasRestantes = 8 - diffDias;
            return diasRestantes <= 7 && diasRestantes > 0;
          }
          return false;
        }).length;
        return { estado, cantidad };
      } else {
        return {
          estado,
          cantidad: this.facturas.filter(f => (f.estado || '').toLowerCase() === estado.toLowerCase()).length
        };
      }
    });
    console.log('Resumen de estados:', this.resumenEstados);
    
    // Agrupar por fecha de recepción
    const agrupado: { [fecha: string]: number } = {};
    this.facturas.forEach(f => {
      const fecha = (f.fechaRecepcion || f.fecha_recepcion || '').slice(0, 10);
      if (fecha) {
        agrupado[fecha] = (agrupado[fecha] || 0) + 1;
      }
    });
    this.resumenPorDia = Object.entries(agrupado)
      .map(([fecha, cantidad]) => ({ fecha, cantidad }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
      
    console.log('Resumen por día:', this.resumenPorDia);
  }
  graficoPorDia: any;
  generarGraficoPorDia() {
    try {
      if (this.graficoPorDia) {
        this.graficoPorDia.destroy();
      }
      
      const ctx = document.getElementById('barChartPorDia') as HTMLCanvasElement;
      if (!ctx) {
        console.error('Canvas element con ID "barChartPorDia" no encontrado');
        return;
      }
      
      const labels = this.resumenPorDia.map(e => e.fecha);
      const data = this.resumenPorDia.map(e => e.cantidad);
      
      console.log('Generando gráfico de líneas con datos:', { labels, data });
      
      this.graficoPorDia = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Facturas ingresadas por día',
          data,
          borderColor: '#3dc2ff',
          backgroundColor: 'rgba(61,194,255,0.2)',
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: '#3dc2ff',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Facturas ingresadas por día' }
        },
        scales: {
          x: { title: { display: true, text: 'Fecha' } },
          y: { beginAtZero: true, title: { display: true, text: 'Cantidad' } }
        },
        onClick: (event: any, elements: any[]) => {
          if (elements && elements.length > 0) {
            const index = elements[0].index;
            const fecha = labels[index];
            this.router.navigate(['/invoices'], { queryParams: { fecha } });
          }
        }
      }
    });
    } catch (error) {
      console.error('Error generando gráfico de líneas:', error);
    }
  }

  generarGrafico() {
    try {
      if (this.chart) {
        this.chart.destroy();
      }
      
      // Verificar que el elemento esté disponible
      if (!this.barChartCanvas || !this.barChartCanvas.nativeElement) {
        console.error('Canvas element no está disponible para el gráfico de barras');
        return;
      }
      
      const labels = this.resumenEstados.map(e => e.estado);
      const data = this.resumenEstados.map(e => e.cantidad);
      
      console.log('Generando gráfico de barras con datos:', { labels, data });
      
      this.chart = new Chart(this.barChartCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels,
        datasets: [{
          label: 'Facturas por estado',
          data,
          backgroundColor: [
            '#ffc409', // Pendiente
            '#2dd36f', // Aceptada
            '#eb445a', // Rechazada
            '#92949c'  // Vencida
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Facturas por Estado' }
        },
        onClick: (event: any, elements: any[]) => {
          if (elements && elements.length > 0) {
            const index = elements[0].index;
            const estado = labels[index];
            this.router.navigate(['/invoices'], { queryParams: { estado } });
          }
        }
      }
    });
    } catch (error) {
      console.error('Error generando gráfico de barras:', error);
    }
  }

  exportarExcel() {
    const facturasFiltradas = this.getFacturasFiltradas();
    if (!facturasFiltradas || facturasFiltradas.length === 0) return;
    const fechaHoy = new Date();
    const fechaStr = fechaHoy.toISOString().slice(0, 10);
    const nombreArchivo = `facturas_filtradas_${fechaStr}.xlsx`;
    // Agregar fila de encabezado con fecha y nombre
    const encabezado = [[`Exportado: ${fechaStr} - Archivo: ${nombreArchivo}`], this.csvHeaders];
    const data = facturasFiltradas.map(f => this.csvHeaders.map(h => this.getValorFactura(f, h)));
    const ws = XLSX.utils.aoa_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, encabezado, { origin: 'A1' });
    XLSX.utils.sheet_add_aoa(ws, data, { origin: `A${encabezado.length + 1}` });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Facturas');
    XLSX.writeFile(wb, nombreArchivo);
  }

  exportarPDF() {
    const facturasFiltradas = this.getFacturasFiltradas();
    if (!facturasFiltradas || facturasFiltradas.length === 0) return;
    const fechaHoy = new Date();
    const fechaStr = fechaHoy.toISOString().slice(0, 10);
    const nombreArchivo = `facturas_filtradas_${fechaStr}.pdf`;
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(12);
    doc.text(`Exportado: ${fechaStr} - Archivo: ${nombreArchivo}`, 14, 12);
    const columns = this.csvHeaders;
    const rows = facturasFiltradas.map(f => columns.map(h => this.getValorFactura(f, h)));
    autoTable(doc, {
      head: [columns],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [123, 38, 58] },
      styles: { fontSize: 8, cellWidth: 'wrap', halign: 'center' },
      margin: { top: 20 }
    });
    doc.save(nombreArchivo);
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