import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Db } from 'src/app/services/Database/db';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
// Registrar Chart.js (asegura que los componentes estén disponibles aunque otra página no se haya cargado)
Chart.register(...registerables);
import jsPDF from 'jspdf';
import * as ExcelJS from 'exceljs';
import autoTable from 'jspdf-autotable';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonIcon, HeaderComponent]
})
export class ReportsPage implements OnInit, OnDestroy, AfterViewInit {

  private readonly dbService = inject(Db);
  private readonly router = inject(Router);
  
  private isDestroyed = false;
  private chartInstances: Chart[] = [];
  private timeoutIds: number[] = [];

  graficoExpandido: 'estado' | 'dia' | null = null;

  expandirGrafico(tipo: 'estado' | 'dia') {
    this.graficoExpandido = tipo;
    const timeoutId = window.setTimeout(() => {
      if (!this.isDestroyed) {
        if (tipo === 'estado') this.generarGrafico();
        if (tipo === 'dia') this.generarGraficoPorDia();
      }
    }, 100);
    this.timeoutIds.push(timeoutId);
  }

  contraerGrafico() {
    this.graficoExpandido = null;
    const timeoutId = window.setTimeout(() => {
      if (!this.isDestroyed) {
        this.generarGrafico();
        this.generarGraficoPorDia();
      }
    }, 100);
    this.timeoutIds.push(timeoutId);
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
    
    if (factura[header] !== undefined && factura[header] !== null && factura[header] !== '') {
      return factura[header];
    }
    
    const lower = header.toLowerCase();
    if (factura[lower] !== undefined && factura[lower] !== null && factura[lower] !== '') {
      return factura[lower];
    }
    
    const noSpaces = header.replace(/\s+/g, '');
    if (factura[noSpaces] !== undefined && factura[noSpaces] !== null && factura[noSpaces] !== '') {
      return factura[noSpaces];
    }
    
    return '';
  }
  // Devuelve las facturas filtradas (por ahora todas, pero aquí puedes aplicar filtros activos)
  getFacturasFiltradas(): any[] {
    // Implementación de filtrado similar a Invoices/Dashboard
    let facturasFiltradas: any[] = [...this.facturas];
    const hoy = new Date();

    // Filtro por fecha exacta (legacy)
    if (this.filtroFecha) {
      facturasFiltradas = facturasFiltradas.filter(f => {
        const fecha = (f.fechaRecepcion || f.fecha || '').slice(0, 10);
        return fecha === this.filtroFecha;
      });
    }

    // Rango de fechas
    if (this.filtroFechaInicio) {
      facturasFiltradas = facturasFiltradas.filter(f => {
        const fecha = (f.fechaRecepcion || f.fecha || '').slice(0, 10);
        return fecha >= this.filtroFechaInicio;
      });
    }
    if (this.filtroFechaFin) {
      facturasFiltradas = facturasFiltradas.filter(f => {
        const fechaRecepcion = (f.fechaRecepcion || f.fecha || '').slice(0, 10);
        if (!fechaRecepcion) return false;
        const fechaVencimiento = new Date(fechaRecepcion);
        fechaVencimiento.setDate(fechaVencimiento.getDate() + 8);
        const fechaVencimientoStr = fechaVencimiento.toISOString().slice(0, 10);
        return fechaVencimientoStr === this.filtroFechaFin;
      });
    }

    // Monto
    if (this.filtroMontoMin !== null && this.filtroMontoMin !== undefined) {
      facturasFiltradas = facturasFiltradas.filter(f => f.monto >= this.filtroMontoMin!);
    }
    if (this.filtroMontoMax !== null && this.filtroMontoMax !== undefined) {
      facturasFiltradas = facturasFiltradas.filter(f => f.monto <= this.filtroMontoMax!);
    }

    // Estado múltiple
    if (this.filtroEstados && this.filtroEstados.length > 0) {
      facturasFiltradas = facturasFiltradas.filter(f => this.filtroEstados.includes((f.estado || '').trim()));
    }

    // Categoría seleccionada
    if (this.categoriaSeleccionada) {
      if (this.categoriaSeleccionada === 'Por Vencer') {
        facturasFiltradas = facturasFiltradas.filter(f => {
          if ((f.estado || '').toLowerCase() === 'pendiente') {
            const fechaEmision = f.fechaRecepcion || f.fecha || '';
            if (!fechaEmision) return false;
            const diffMs = hoy.getTime() - new Date(fechaEmision).getTime();
            const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const diasRestantes = 8 - diffDias;
            return diasRestantes <= 7 && diasRestantes > 0;
          }
          return false;
        });
      } else {
        facturasFiltradas = facturasFiltradas.filter(f =>
          (f.estado || '').toLowerCase() === this.categoriaSeleccionada!.toLowerCase()
        );
      }
    }

    // Por vencer flag
    if (this.mostrarPorVencer) {
      facturasFiltradas = facturasFiltradas.filter(f => {
        if ((f.estado || '').toLowerCase() === 'pendiente') {
          const fechaEmision = f.fechaRecepcion || f.fecha || '';
          if (!fechaEmision) return false;
          const diffMs = hoy.getTime() - new Date(fechaEmision).getTime();
          const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const diasRestantes = 8 - diffDias;
          return diasRestantes <= 7 && diasRestantes > 0;
        }
        return false;
      });
    }

    // Búsqueda textual
    if (this.filtroBusqueda && this.filtroBusqueda.trim() !== '') {
      const texto = this.filtroBusqueda.trim().toLowerCase();
      const regex = new RegExp(`(^|\\s|\\W)${texto}($|\\s|\\W)`, 'i');
      if (this.campoBusqueda === 'folio') {
        facturasFiltradas = facturasFiltradas.filter(f => f.folio && regex.test(f.folio));
      } else if (this.campoBusqueda === 'proveedor') {
        facturasFiltradas = facturasFiltradas.filter(f => f.proveedor && regex.test(f.proveedor));
      } else if (this.campoBusqueda === 'responsable') {
        facturasFiltradas = facturasFiltradas.filter(f => f.responsable && regex.test(f.responsable));
      } else if (this.campoBusqueda === 'rut') {
        facturasFiltradas = facturasFiltradas.filter(f => f['RUT Emisor'] && f['RUT Emisor'].toLowerCase() === texto);
      } else {
        facturasFiltradas = facturasFiltradas.filter(f =>
          (f.folio && regex.test(f.folio)) ||
          (f['RUT Emisor'] && regex.test(f['RUT Emisor'])) ||
          (f.proveedor && regex.test(f.proveedor)) ||
          (f.responsable && regex.test(f.responsable))
        );
      }
    }

    // Ordenamiento simple: por fecha desc
    return facturasFiltradas.sort((a, b) => {
      const fechaA = new Date(a.fechaRecepcion || a.fecha || 0).getTime();
      const fechaB = new Date(b.fechaRecepcion || b.fecha || 0).getTime();
      return fechaB - fechaA;
    });
  }

  // --- Filtros y helpers ---
  categoriasResumen = [
    { nombre: 'Pendientes', estado: 'Pendiente', color: 'warning', selected: false },
    { nombre: 'Por Vencer', estado: 'Por Vencer', color: 'medium', selected: false },
    { nombre: 'Acuse Recibo', estado: 'Acuse Recibo', color: 'success', selected: false },
    { nombre: 'Reclamado', estado: 'Reclamado', color: 'warning', selected: false },
    { nombre: 'Cedidas', estado: 'Cedida', color: 'dark', selected: false }
  ];

  filtroFechaInicio: string = '';
  filtroFechaFin: string = '';
  filtroMontoMin: number | null = null;
  filtroMontoMax: number | null = null;
  filtroEstados: string[] = [];
  filtroBusqueda: string = '';
  campoBusqueda: string = 'todos';
  filtroFecha: string = '';
  categoriaSeleccionada: string | null = null;
  mostrarPorVencer: boolean = false;

  syncFiltroEstados() {
    this.filtroEstados = this.categoriasResumen.filter(c => !!c.selected).map(c => c.estado);
    this.aplicarFiltrosAvanzados();
  }

  limpiarTodosFiltros() {
    this.categoriaSeleccionada = null;
    this.filtroBusqueda = '';
    this.filtroFecha = '';
    this.filtroFechaInicio = '';
    this.filtroFechaFin = '';
    this.filtroMontoMin = null;
    this.filtroMontoMax = null;
    this.filtroEstados = [];
    this.mostrarPorVencer = false;
    this.categoriasResumen.forEach(c => c.selected = false);
    this.aplicarFiltrosAvanzados();
  }

  aplicarFiltrosAvanzados() {
    // Recalcular resumen y resúmenes por día con la fuente filtrada
    const datos = this.getFacturasFiltradas();
    // Resumen de estados según categoriasResumen
    const estados = this.categoriasResumen.map(c => c.estado);
    this.resumenEstados = estados.map(estado => {
      if (estado === 'Por Vencer') {
        const hoy = new Date();
        const cantidad = datos.filter(f => {
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
      }
      return { estado, cantidad: datos.filter(f => (f.estado || '').toLowerCase() === estado.toLowerCase()).length };
    });

    // Resumen por día
    const agrupado: { [fecha: string]: number } = {};
    datos.forEach(f => {
      const fecha = (f.fechaRecepcion || f.fecha_recepcion || '').slice(0, 10);
      if (fecha) agrupado[fecha] = (agrupado[fecha] || 0) + 1;
    });
    this.resumenPorDia = Object.entries(agrupado).map(([fecha, cantidad]) => ({ fecha, cantidad })).sort((a, b) => a.fecha.localeCompare(b.fecha));

    // Regenerar gráficos
    const timeoutId = window.setTimeout(() => {
      if (!this.isDestroyed) {
        this.generarGrafico();
        this.generarGraficoPorDia();
      }
    }, 50);
    this.timeoutIds.push(timeoutId);
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

  async ngAfterViewInit() {
    if (this.isDestroyed) return;
    
    await this.cargarDatos();
    // Pequeño delay para asegurar que el DOM esté completamente renderizado
    const timeoutId = window.setTimeout(() => {
      if (!this.isDestroyed) {
        this.generarGrafico();
        this.generarGraficoPorDia();
      }
    }, 100);
    this.timeoutIds.push(timeoutId);
  }

  async cargarDatos() {
    try {
      // Leer primero desde localStorage (facturas importadas por CSV)
      const facturasGuardadas = localStorage.getItem('facturasCSV');
      if (facturasGuardadas) {
        this.facturas = JSON.parse(facturasGuardadas);
      } else {
        this.facturas = await this.dbService.getFacturas() || [];
      }
      
      // Inicializar resúmenes y gráficos usando los filtros por defecto
      this.aplicarFiltrosAvanzados();
    } catch (error) {
      console.error('Error cargando datos:', error);
      this.facturas = [];
    }
  }
  graficoPorDia: any;
  
  generarGraficoPorDia() {
    if (this.isDestroyed) return;
    
    try {
      if (this.graficoPorDia) {
        this.graficoPorDia.destroy();
      }
      
      const ctx = document.getElementById('barChartPorDia') as HTMLCanvasElement;
      if (!ctx) {
        return;
      }
      
      const labels = this.resumenPorDia.map(e => e.fecha);
      const data = this.resumenPorDia.map(e => e.cantidad);
      
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
    if (this.isDestroyed) return;
    
    try {
      if (this.chart) {
        this.chart.destroy();
      }
      
      // Verificar que el elemento esté disponible
      if (!this.barChartCanvas || !this.barChartCanvas.nativeElement) {
        return;
      }
      
      const labels = this.resumenEstados.map(e => e.estado);
      const data = this.resumenEstados.map(e => e.cantidad);
      
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

  async exportarExcel() {
    const facturasFiltradas = this.getFacturasFiltradas();
    if (!facturasFiltradas || facturasFiltradas.length === 0) return;
    const fechaHoy = new Date();
    const fechaStr = fechaHoy.toISOString().slice(0, 10);
    const nombreArchivo = `facturas_filtradas_${fechaStr}.xlsx`;
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Facturas');
    
    // Agregar título
    worksheet.addRow([`Exportado: ${fechaStr} - Archivo: ${nombreArchivo}`]);
    worksheet.addRow([]);
    
    // Agregar encabezados
    worksheet.addRow(this.csvHeaders);
    
    // Agregar datos
    facturasFiltradas.forEach(f => {
      const row = this.csvHeaders.map(h => this.getValorFactura(f, h));
      worksheet.addRow(row);
    });
    
    // Estilo para la primera fila (título)
    worksheet.getRow(1).font = { bold: true };
    
    // Estilo para los encabezados
    worksheet.getRow(3).font = { bold: true };
    worksheet.getRow(3).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    
    // Autoajustar columnas
    worksheet.columns.forEach((column: Partial<ExcelJS.Column>) => {
      if (column) {
        column.width = 15;
      }
    });
    
    // Descargar el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    window.URL.revokeObjectURL(url);
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
        this.cargarDatos();
        break;
      default:
        // Acción no reconocida - podría implementarse logging en producción
        break;
    }
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    
    // Destruir todas las instancias de charts
    this.chartInstances.forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });
    this.chartInstances = [];
    
    // Destruir charts específicos
    if (this.chart && typeof this.chart.destroy === 'function') {
      this.chart.destroy();
    }
    if (this.graficoPorDia && typeof this.graficoPorDia.destroy === 'function') {
      this.graficoPorDia.destroy();
    }
    
    // Limpiar timeouts
    this.timeoutIds.forEach(id => clearTimeout(id));
    this.timeoutIds = [];
  }
}