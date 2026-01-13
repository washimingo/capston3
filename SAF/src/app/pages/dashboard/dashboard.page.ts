import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { 
  IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, 
  IonButton, IonIcon
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { Factura } from 'src/app/models/factura.model';
import { Chart, registerables } from 'chart.js';
import { Db } from 'src/app/services/Database/db';
import * as ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Registrar componentes de Chart.js una sola vez a nivel de módulo
Chart.register(...registerables);

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
export class DashboardPage implements OnInit, AfterViewInit, OnDestroy {
  graficoExpandido: 'estados' | 'mensual' | 'montos' | null = null;

  private readonly router = inject(Router);
  private dbInstance: Db = new Db();
  private chartInstances: Chart[] = [];
  private intervalIds: number[] = [];
  private isDestroyed = false;

  // Navegación a invoices con filtros
  irAInvoicesPorVencerHoy() {
    this.router.navigate(['/invoices'], { queryParams: { estado: 'Por Vencer' } });
  }
  irAInvoicesTotal() {
    this.router.navigate(['/invoices']);
  }

  expandirGrafico(tipo: 'estados' | 'mensual' | 'montos') {
    this.graficoExpandido = tipo;
    setTimeout(() => {
      if (tipo === 'estados') this.generarGraficoEstados();
      if (tipo === 'mensual') this.generarGraficoMensual();
      if (tipo === 'montos') this.generarGraficoMontos();
    }, 100);
  }

  contraerGrafico() {
    this.graficoExpandido = null;
    setTimeout(() => {
      this.generarGraficoTorta();
      this.generarGraficoEstados();
      this.generarGraficoMensual();
      this.generarGraficoMontos();
    }, 100);
  }
  // Navegar a invoices filtrando por proveedor
  irAInvoicesProveedor(rut: string) {
    this.router.navigate(['/invoices'], { queryParams: { proveedor: rut } });
  }
  @ViewChild('pieChartCanvas', { static: false }) pieChartCanvas!: ElementRef;
  @ViewChild('estadosChartCanvas', { static: false }) estadosChartCanvas!: ElementRef;
  @ViewChild('mensualChartCanvas', { static: false }) mensualChartCanvas!: ElementRef;
  @ViewChild('montosChartCanvas', { static: false }) montosChartCanvas!: ElementRef;

  pieChart: any;
  estadosChart: any;
  mensualChart: any;
  montosChart: any;

  facturas: any[] = [];
  proveedores: string[] = [];
  montosPorProveedor: number[] = [];
  meses: string[] = [];
  cantidadPorMes: number[] = [];
  montoPorMes: number[] = [];
  resumenEstados: { estado: string, cantidad: number }[] = [];
  resumenPorDia: { fecha: string, cantidad: number }[] = [];

  mostrarDetallesRuts: boolean = false;
  vistaDetallada: boolean = true;
  ordenActual: string = 'monto';
  archivoCSV: string = '';
  contenidoCSV: string = '';

  // Headers para exportar
  csvHeaders: string[] = [
    'Nro.', 'RUT Emisor', 'Folio', 'Fecha Docto.', 'Monto Neto', 'Monto Exento',
    'Monto IVA', 'Monto Total', 'Fecha Recep.', 'Evento Receptor', 'Codigo Otro Impto',
    'Valor Otro Impto', 'Tasa Otro Impto'
  ];

  // ---- Filtros (equivalentes a Invoices) ----
  categoriasResumen = [
    { nombre: 'Pendientes', estado: 'Pendiente', color: 'warning', selected: false },
    { nombre: 'Por Vencer', estado: 'Por Vencer', color: 'medium', selected: false },
    { nombre: 'Acuse Recibo', estado: 'Acuse Recibo', color: 'success', selected: false },
    { nombre: 'Reclamado', estado: 'Reclamado', color: 'danger', selected: false },
    { nombre: 'Cedidas', estado: 'Cedida', color: 'dark', selected: false },
  ];

  filtroFechaInicio: string = '';
  filtroFechaFin: string = '';
  filtroMontoMin: number | null = null;
  filtroMontoMax: number | null = null;
  filtroEstados: string[] = [];
  filtroBusqueda = '';
  campoBusqueda: string = 'todos';
  filtroFecha = '';
  categoriaSeleccionada: string | null = null;
  mostrarPorVencer: boolean = false;
  mostrarFiltrosAvanzados: boolean = false;
  paginaActual: number = 1;
  elementosPorPagina: number = 25;

  // Sincroniza el array de estados seleccionados (usado por checkboxes)
  syncFiltroEstados() {
    this.filtroEstados = this.categoriasResumen
      .filter(c => !!c.selected)
      .map(c => c.estado);
    // refrescar gráficos/resumen
    this.aplicarFiltrosAvanzados();
  }

  // Función para selección múltiple de categorías (chips)
  seleccionarCategoria(categoriaSeleccionada: any) {
    // Toggle: activar/desactivar la categoría seleccionada
    categoriaSeleccionada.selected = !categoriaSeleccionada.selected;
    
    // Actualizar filtros
    this.syncFiltroEstados();
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

  ngOnDestroy(): void {
    this.isDestroyed = true;
    
    // Destruir todas las instancias de charts
    this.chartInstances.forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });
    this.chartInstances = [];
    
    // Limpiar intervalos
    this.intervalIds.forEach(id => clearTimeout(id));
    this.intervalIds = [];
  }

  aplicarFiltrosAvanzados() {
    // Recalcular resúmenes y regenerar gráficos con los datos filtrados
    this.calcularMontosPorProveedor();
    this.calcularEvolucionMensual();
    this.calcularResumenEstados();
    this.calcularResumenPorDia();
    // Regenerar los gráficos visibles
    setTimeout(() => {
      this.generarGraficoTorta();
      this.generarGraficoEstados();
      this.generarGraficoMensual();
      this.generarGraficoMontos();
    }, 50);
  }

  // Obtener facturas aplicando los mismos filtros que en Invoices
  getFacturasFiltradas(): Factura[] {
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

    // Ordenar similar a Invoices
    return facturasFiltradas.sort((a, b) => {
      const getDiasRestantes = (factura: Factura) => {
        const fechaEmision = factura.fechaRecepcion || factura.fecha || '';
        if (!fechaEmision) return 9999;
        const diffMs = hoy.getTime() - new Date(fechaEmision).getTime();
        const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        return 8 - diffDias;
      };
      const diasA = getDiasRestantes(a);
      const diasB = getDiasRestantes(b);
      const aPorVencer = diasA > 0 && diasA <= 2;
      const bPorVencer = diasB > 0 && diasB <= 2;
      if (aPorVencer && !bPorVencer) return -1;
      if (!aPorVencer && bPorVencer) return 1;
      const fechaA = new Date(a.fechaRecepcion || a.fecha || 0).getTime();
      const fechaB = new Date(b.fechaRecepcion || b.fecha || 0).getTime();
      return fechaB - fechaA;
    });
  }

  async ngOnInit() {
    if (this.isDestroyed) return;
    
    try {
      await this.loadData();
      this.calcularEstadisticas();
    } catch (error) {
      console.error('Error inicializando dashboard:', error);
    }
  }
  
  private async loadData(): Promise<void> {
    try {
      const facturasGuardadas = localStorage.getItem('facturasCSV');
      if (facturasGuardadas) {
        this.facturas = JSON.parse(facturasGuardadas);
        this.archivoCSV = localStorage.getItem('archivoCSV') || '';
        this.contenidoCSV = localStorage.getItem('contenidoCSV') || '';
      } else {
        this.facturas = await this.dbInstance.getFacturas() || [];
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      this.facturas = [];
    }
  }
  
  private calcularEstadisticas(): void {
    if (this.isDestroyed) return;
    
    this.calcularMontosPorProveedor();
    this.calcularEvolucionMensual();
    this.calcularResumenEstados();
    this.calcularResumenPorDia();
  }

  ngAfterViewInit(): void {
    if (this.isDestroyed) return;
    
    const timeoutId = window.setTimeout(() => {
      if (!this.isDestroyed) {
        if (this.proveedores.length > 0 && this.montosPorProveedor.length > 0) {
          this.initializeCharts();
        } else {
          this.cargarDatosYGenerarGrafico();
        }
      }
    }, 500);
    
    this.intervalIds.push(timeoutId);
  }
  
  private initializeCharts(): void {
    if (this.isDestroyed) return;
    
    const timeoutId = window.setTimeout(() => {
      if (!this.isDestroyed) {
        this.generarGraficoTorta();
        this.generarGraficoEstados();
        this.generarGraficoMensual();
        this.generarGraficoMontos();
      }
    }, 100);
    
    this.intervalIds.push(timeoutId);
  }

  async cargarDatosYGenerarGrafico(): Promise<void> {
    if (this.isDestroyed) return;
    
    try {
      if (this.facturas.length === 0) {
        await this.loadData();
      }
      
      if (!this.isDestroyed && this.facturas.length > 0) {
        this.calcularEstadisticas();
        this.initializeCharts();
      }
    } catch (error) {
      console.error('Error cargando datos y generando gráficos:', error);
    }
  }

  // Gráfico de estado de facturas - con leyenda al lado
  generarGraficoEstados(): void {
    if (!this.estadosChartCanvas?.nativeElement) return;
    if (this.estadosChart) this.estadosChart.destroy();

    // Usar categoriasResumen como fuente única de estados y colores
    const estados = this.categoriasResumen.map(c => c.estado);
    const colores = this.categoriasResumen.map(c => {
      switch ((c.color || '').toLowerCase()) {
        case 'warning': return '#ffc409';
        case 'medium': return '#3dc2ff';
        case 'success': return '#2dd36f';
        case 'danger': return '#eb445a';
        case 'dark': return '#334155';
        case 'primary': return '#3b82f6';
        default: return '#9CA3AF';
      }
    });
    const hoy = new Date();
    const datosFuente = this.getFacturasFiltradas();
    const datos = estados.map(estado => {
      if (estado === 'Por Vencer') {
        return datosFuente.filter(f => {
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
      } else {
        return datosFuente.filter(f => (f.estado || '').toLowerCase() === estado.toLowerCase()).length;
      }
    });

    this.estadosChart = new Chart(this.estadosChartCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: estados,
        datasets: [{
          data: datos,
          backgroundColor: colores,
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'right',
            align: 'center',
            labels: {
              padding: 15,
              usePointStyle: true,
              font: { size: 11 },
              boxWidth: 12,
              boxHeight: 12
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = (context.dataset.data as number[]).reduce((a: number, b: number) => a + b, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        layout: { padding: 10 },
        onClick: (event: any, elements: any[]) => {
          if (elements && elements.length > 0) {
            const index = elements[0].index;
            const estado = estados[index];
            // Navegar a invoices filtrando por estado
            this.router.navigate(['/invoices'], { queryParams: { estado: estado } });
          }
        }
      }
    });
  }

  // Nuevo gráfico de tendencia mensual
  generarGraficoMensual(): void {
    if (!this.mensualChartCanvas?.nativeElement) return;
    if (this.mensualChart) this.mensualChart.destroy();

    // Agrupar facturas por mes usando facturas filtradas
    const facturasPorMes: { [key: string]: number } = {};
    const datosFuente = this.getFacturasFiltradas();
    datosFuente.forEach(factura => {
      if (factura['fechaEmision']) {
        const fecha = new Date(factura['fechaEmision']);
        const mes = fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        facturasPorMes[mes] = (facturasPorMes[mes] || 0) + 1;
      }
    });

    const meses = Object.keys(facturasPorMes).slice(-6); // Últimos 6 meses
    const cantidades = meses.map(mes => facturasPorMes[mes]);

    this.mensualChart = new Chart(this.mensualChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: meses,
        datasets: [{
          label: 'Facturas por mes',
          data: cantidades,
          borderColor: '#2dd36f',
          backgroundColor: 'rgba(45, 211, 111, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#2dd36f',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            cornerRadius: 8
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.1)' },
            ticks: { color: '#6B7280', font: { size: 11 } }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#374151', font: { size: 11 } }
          }
        }
      }
    });
  }

  // Nuevo gráfico de distribución de montos
  generarGraficoMontos(): void {
    if (!this.montosChartCanvas?.nativeElement) return;
    if (this.montosChart) this.montosChart.destroy();

    // Rangos de montos (etiquetas para visual)
    const rangos = [
      { label: '< $100K', min: 0, max: 100000 },
      { label: '$100K - $500K', min: 100000, max: 500000 },
      { label: '$500K - $1M', min: 500000, max: 1000000 },
      { label: '$1M - $5M', min: 1000000, max: 5000000 },
      { label: '> $5M', min: 5000000, max: Infinity }
    ];

    const datosFuente = this.getFacturasFiltradas();

    // Calcular monto total y cantidad por rango
    const montoPorRango = rangos.map(rango => {
      const items = datosFuente.filter(f => {
        const monto = Number(f['Monto Total'] || f['monto'] || f['montoTotal'] || 0);
        return monto >= rango.min && monto < rango.max;
      });
      const suma = items.reduce((s, it) => s + Number(it['Monto Total'] || it['monto'] || 0), 0);
      return { suma, count: items.length };
    });

    const labels = rangos.map(r => r.label);
    const dataMontos = montoPorRango.map(r => r.suma);
    const dataCounts = montoPorRango.map(r => r.count);
    const totalMontos = dataMontos.reduce((a, b) => a + b, 0);

    // Crear degradado
    const ctx = this.montosChartCanvas.nativeElement.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
    grad.addColorStop(0, '#06b6d4');
    grad.addColorStop(0.5, '#8b5cf6');
    grad.addColorStop(1, '#ef4444');

    this.montosChart = new Chart(this.montosChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Monto total por rango (CLP)',
          data: dataMontos,
          backgroundColor: grad,
          borderRadius: 8,
          barThickness: 18,
          maxBarThickness: 36
        }]
      },
      options: {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            callbacks: {
              title: (ctx) => ctx[0].label || '',
              label: (context) => {
                const idx = context.dataIndex;
                const monto = dataMontos[idx] || 0;
                const cantidad = dataCounts[idx] || 0;
                const porcentaje = totalMontos > 0 ? ((monto / totalMontos) * 100).toFixed(1) : '0.0';
                return [`Monto: $${monto.toLocaleString('es-CL')}`, `Cantidad: ${cantidad} facturas`, `Share: ${porcentaje}%`];
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              callback: (val) => {
                const v = Number(val);
                if (isNaN(v)) return val;
                if (v >= 1000000) return '$' + (v / 1000000).toFixed(1) + 'M';
                if (v >= 1000) return '$' + (v / 1000).toFixed(0) + 'K';
                return '$' + v.toLocaleString('es-CL');
              }
            },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          y: { grid: { display: false } }
        },
        layout: { padding: { top: 6, right: 10, bottom: 6, left: 10 } }
      }
    });
  }

  // Gráfico de proveedores (barras horizontales)
  generarGraficoTorta(): void {
    if (!this.pieChartCanvas?.nativeElement) return;
    if (!this.proveedores.length || !this.montosPorProveedor.length) {
      this.proveedores = ['Sin datos'];
      this.montosPorProveedor = [1];
    }
    if (this.pieChart) this.pieChart.destroy();

    // Obtener top 8 proveedores para hacer más compacto
    const proveedoresData = this.proveedores.map((proveedor, index) => ({
      nombre: proveedor,
      monto: this.montosPorProveedor[index]
    })).sort((a, b) => b.monto - a.monto);

    const top8 = proveedoresData.slice(0, 8);
    const otros = proveedoresData.slice(8);
    const montoOtros = otros.reduce((sum, item) => sum + item.monto, 0);
    
    // Preparar etiquetas (truncar RUTs muy largos para mejor visualización)
    const labels = top8.map(item => {
      const nombre = item.nombre;
      if (nombre.length > 12) {
        return nombre.substring(0, 12) + '...';
      }
      return nombre;
    });
    
    const data = top8.map(item => item.monto);
    
    // Agregar "Otros" si hay más de 8 proveedores
    if (montoOtros > 0) {
      labels.push(`Otros (${otros.length})`);
      data.push(montoOtros);
    }

    this.pieChart = new Chart(this.pieChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Monto por proveedor',
          data,
          backgroundColor: [
            '#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', 
            '#F44336', '#8BC34A', '#FFC107', '#95A5A6'
          ],
          borderColor: [
            '#2196F3', '#E91E63', '#FFC107', '#00BCD4', '#9C27B0',
            '#D32F2F', '#689F38', '#FF8F00', '#616161'
          ],
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false
        }]
      },
      options: {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            cornerRadius: 8,
            displayColors: false,
            titleFont: { size: 13 },
            bodyFont: { size: 12 },
            callbacks: {
              title: function(context) {
                return context[0].label;
              },
              label: function(context) {
                const value = context.parsed.x;
                if (value === null) return '';
                const dataValues = context.dataset.data as number[];
                const total = dataValues.reduce((a: number, b: number) => a + b, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                return [
                  `Monto: $${value.toLocaleString('es-CL')}`,
                  `Porcentaje: ${percentage}%`
                ];
              }
            }
          }
        },
        onClick: (event: any, elements: any[]) => {
          if (elements && elements.length > 0) {
            const index = elements[0].index;
            // Si es "Otros", no filtrar
            if (labels[index] && !labels[index].startsWith('Otros')) {
              // El label es el rut del proveedor
              this.irAInvoicesProveedor(top8[index].nombre);
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.1)' },
            ticks: {
              color: '#6B7280',
              font: { size: 11 },
              callback: function(value) {
                const numValue = Number(value);
                if (numValue >= 1000000) {
                  return '$' + (numValue / 1000000).toFixed(1) + 'M';
                } else if (numValue >= 1000) {
                  return '$' + (numValue / 1000).toFixed(0) + 'K';
                }
                return '$' + numValue.toLocaleString('es-CL');
              }
            }
          },
          y: {
            grid: { display: false },
            ticks: {
              color: '#374151',
              font: { size: 11, weight: 'bold' },
              maxRotation: 0
            }
          }
        },
        layout: { 
          padding: { top: 10, right: 20, bottom: 10, left: 10 }
        }
      }
    });
  }

  // Utilidades y lógica de datos
  calcularMontosPorProveedor(): void {
    const resumen: { [proveedor: string]: number } = {};
    const datosFuente = this.getFacturasFiltradas();

    datosFuente.forEach((f) => {
      const rut = this.getRutFromFactura(f);
      const nombre = this.getNombreProveedor(f);
      const clave = rut && rut !== '-' ? rut : nombre;
  const monto = Number(f['Monto Total'] || f['monto'] || f['total'] || f['Monto Neto'] || 0);

      resumen[clave] = (resumen[clave] || 0) + monto;
    });

    this.proveedores = Object.keys(resumen);
    this.montosPorProveedor = Object.values(resumen);
  }

  getNombreProveedor(f: any): string {
    const camposNombre = [
      'razonSocial', 'nombre', 'proveedor', 'nombreProveedor', 'empresa',
      'RazonSocial', 'Nombre', 'Proveedor', 'NombreProveedor', 'Empresa',
      'razon_social', 'nombre_proveedor', 'empresa_nombre'
    ];
    
    for (const campo of camposNombre) {
      if (f[campo] && typeof f[campo] === 'string' && f[campo].trim() !== '') {
        const nombre = f[campo].trim();
        if (!/^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-[0-9kK]$/.test(nombre)) {
          return nombre;
        }
      }
    }
    
    const rut = this.getRutFromFactura(f);
    return rut !== '-' ? rut : 'Sin identificar';
  }

  getRutFromFactura(f: any): string {
    const camposRut = [
      'RUT Emisor', 'rutEmisor', 'rut', 'rutProveedor', 'rut_proveedor', 
      'RUT', 'RUTEmisor', 'RUTProveedor', 'emisorRUT', 'emisorRut', 
      'rut_emisor', 'rut_emisor_factura', 'Rut', 'RutEmisor'
    ];
    
    for (const campo of camposRut) {
      if (f[campo] && typeof f[campo] === 'string' && f[campo].trim() !== '') {
        return f[campo].trim();
      }
    }
    
    for (const key of Object.keys(f)) {
      if (typeof f[key] === 'string') {
        const valor = f[key].trim();
        if (/^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-[0-9kK]$/.test(valor)) {
          return valor;
        }
      }
    }
    
    return '-';
  }

  getProveedoresDetallados(): any[] {
    const resumen: { [key: string]: { nombre: string, rut: string, monto: number, cantidad: number, facturas: any[] } } = {};
    
    this.facturas.forEach(f => {
      const rut = this.getRutFromFactura(f);
      const nombre = this.getNombreProveedor(f);
      const clave = rut && rut !== '-' ? rut : nombre;
  const monto = Number(f['Monto Total'] || f['monto'] || f['total'] || f['Monto Neto'] || 0);
      
      if (!resumen[clave]) {
        resumen[clave] = { 
          nombre: nombre, 
          rut: rut, 
          monto: 0, 
          cantidad: 0, 
          facturas: [] 
        };
      }
      
      resumen[clave].monto += monto;
      resumen[clave].cantidad += 1;
      resumen[clave].facturas.push(f);
    });
    
    let resultado = Object.values(resumen);
    
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
      default:
        resultado.sort((a, b) => b.monto - a.monto);
    }
    
    return resultado;
  }

  calcularEvolucionMensual(): void {
    const resumenMeses: { [mes: string]: { cantidad: number, monto: number } } = {};
    const datosFuente = this.getFacturasFiltradas();
    datosFuente.forEach(f => {
      const fecha = f['fechaRecepcion'] || f['fecha'] || f['fecha_recepcion'] || '';
      if (!fecha) return;
      const mes = fecha.slice(0, 7);
      if (!resumenMeses[mes]) resumenMeses[mes] = { cantidad: 0, monto: 0 };
      resumenMeses[mes].cantidad += 1;
      resumenMeses[mes].monto += Number(f.monto) || 0;
    });
    this.meses = Object.keys(resumenMeses).sort();
    this.cantidadPorMes = this.meses.map(m => resumenMeses[m].cantidad);
    this.montoPorMes = this.meses.map(m => resumenMeses[m].monto);
  }

  calcularResumenEstados(): void {
    const estados = ['Pendiente', 'Aceptada', 'Rechazada', 'Vencida'];
    const datosFuente = this.getFacturasFiltradas();
    this.resumenEstados = estados.map(estado => ({
      estado,
      cantidad: datosFuente.filter(f => (f.estado || '').toLowerCase() === estado.toLowerCase()).length
    }));
  }

  calcularResumenPorDia(): void {
    const agrupado: { [fecha: string]: number } = {};
    const datosFuente = this.getFacturasFiltradas();
    datosFuente.forEach(f => {
      const fecha = (f['fechaRecepcion'] || f['fecha_recepcion'] || '').slice(0, 10);
      if (fecha) {
        agrupado[fecha] = (agrupado[fecha] || 0) + 1;
      }
    });
    this.resumenPorDia = Object.entries(agrupado)
      .map(([fecha, cantidad]) => ({ fecha, cantidad }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
  }

  getValorFactura(factura: any, header: string): any {
    if (!factura || !header) return '';
    if (factura[header] !== undefined && factura[header] !== null && factura[header] !== '') return factura[header];
    const lower = header.toLowerCase();
    if (factura[lower] !== undefined && factura[lower] !== null && factura[lower] !== '') return factura[lower];
    const noSpaces = header.replace(/\s+/g, '');
    if (factura[noSpaces] !== undefined && factura[noSpaces] !== null && factura[noSpaces] !== '') return factura[noSpaces];
    return '';
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
        this.refreshDashboard();
        break;
      default:
        // Acción no reconocida - podría implementarse logging en producción
        break;
    }
  }
  
  private async refreshDashboard(): Promise<void> {
    try {
      // Limpiar datos anteriores
      this.facturas = [];
      
      // Recargar datos
      await this.loadData();
      this.calcularEstadisticas();
      
      // Regenerar gráficos
      if (!this.isDestroyed) {
        this.initializeCharts();
      }
    } catch (error) {
      console.error('Error actualizando dashboard:', error);
    }
  }

  toggleMostrarRuts(): void {
    this.mostrarDetallesRuts = !this.mostrarDetallesRuts;
  }

  toggleVisualizacion(): void {
    this.vistaDetallada = !this.vistaDetallada;
    setTimeout(() => this.generarGraficoTorta(), 100);
  }

  ordenarPor(campo: string): void {
    this.ordenActual = campo;
  }

  getFacturasPorVencerHoy(): any[] {
    const hoy = new Date();
    return this.facturas.filter(f => {
      if ((f.estado || '').toLowerCase() !== 'pendiente') return false;
      
      const fechaEmision = f.fechaRecepcion || f.fecha || '';
      if (!fechaEmision) return false;
      
      const diffMs = hoy.getTime() - new Date(fechaEmision).getTime();
      const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diasRestantes = 8 - diffDias;
      
      return diasRestantes === 0; // Exactamente hoy
    });
  }

  getPercentage(cantidad: number): string {
    const total = this.resumenEstados.reduce((sum, item) => sum + item.cantidad, 0);
    return total > 0 ? ((cantidad / total) * 100).toFixed(1) : '0';
  }

  getMontoTotalFacturacion(): number {
    return this.montosPorProveedor.reduce((acc, monto) => acc + monto, 0);
  }

  getProveedorPorcentaje(monto: number): string {
    const total = this.getMontoTotalFacturacion();
    return total > 0 ? ((monto / total) * 100).toFixed(1) : '0';
  }
}