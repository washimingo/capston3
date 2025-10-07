import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { 
  IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, 
  IonButton, IonIcon
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { Chart, registerables } from 'chart.js';
import { Db } from 'src/app/services/Database/db';
import { addIcons } from 'ionicons';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  refreshOutline, alarmOutline, documentTextOutline, cashOutline, calendarOutline,
  pieChartOutline, expandOutline, contractOutline, trophyOutline, checkmarkCircleOutline,
  alertCircleOutline, filterOutline, eyeOutline, checkmarkOutline, warningOutline,
  arrowForwardOutline, listOutline, businessOutline, funnelOutline, downloadOutline,
  swapVerticalOutline, cloudDownloadOutline, analyticsOutline, statsChartOutline,
  receiptOutline, timeOutline, trendingUpOutline, printOutline, shareOutline,
  gridOutline, barChartOutline, settingsOutline, closeCircleOutline, homeOutline
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

  constructor(private dbService: Db, private router: Router) {
    Chart.register(...registerables);
    addIcons({
      refreshOutline, alarmOutline, documentTextOutline, cashOutline, calendarOutline,
      pieChartOutline, listOutline, businessOutline, funnelOutline, downloadOutline,
      swapVerticalOutline, eyeOutline, filterOutline, trophyOutline, checkmarkCircleOutline,
      alertCircleOutline, checkmarkOutline, warningOutline, arrowForwardOutline,
      expandOutline, contractOutline, cloudDownloadOutline, analyticsOutline, statsChartOutline,
      receiptOutline, timeOutline, trendingUpOutline, printOutline, shareOutline,
      gridOutline, barChartOutline, settingsOutline, closeCircleOutline, homeOutline
    });
  }

  async ngOnInit() {
    const facturasGuardadas = localStorage.getItem('facturasCSV');
    if (facturasGuardadas) {
      this.facturas = JSON.parse(facturasGuardadas);
      this.archivoCSV = localStorage.getItem('archivoCSV') || '';
      this.contenidoCSV = localStorage.getItem('contenidoCSV') || '';
    } else {
      this.facturas = await this.dbService.getFacturas();
    }
    
    this.calcularMontosPorProveedor();
    this.calcularEvolucionMensual();
    this.calcularResumenEstados();
    this.calcularResumenPorDia();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.proveedores.length > 0 && this.montosPorProveedor.length > 0) {
        this.generarGraficoTorta();
        this.generarGraficoEstados();
        this.generarGraficoMensual();
        this.generarGraficoMontos();
      } else {
        this.cargarDatosYGenerarGrafico();
      }
    }, 500);
  }

  async cargarDatosYGenerarGrafico() {
    if (this.facturas.length === 0) {
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
      setTimeout(() => {
        this.generarGraficoTorta();
        this.generarGraficoEstados();
        this.generarGraficoMensual();
        this.generarGraficoMontos();
      }, 100);
    }
  }

  // Gráfico de estado de facturas - con leyenda al lado
  generarGraficoEstados(): void {
    if (!this.estadosChartCanvas?.nativeElement) return;
    if (this.estadosChart) this.estadosChart.destroy();

    const estados = ['Pendiente', 'Aceptada', 'Rechazada', 'Vencida'];
    const colores = ['#ffc409', '#2dd36f', '#eb445a', '#92949c'];
    const datos = estados.map(estado => 
      this.facturas.filter(f => (f.estado || '').toLowerCase() === estado.toLowerCase()).length
    );

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
        layout: { padding: 10 }
      }
    });
  }

  // Nuevo gráfico de tendencia mensual
  generarGraficoMensual(): void {
    if (!this.mensualChartCanvas?.nativeElement) return;
    if (this.mensualChart) this.mensualChart.destroy();

    // Agrupar facturas por mes
    const facturasPorMes: { [key: string]: number } = {};
    this.facturas.forEach(factura => {
      if (factura.fechaEmision) {
        const fecha = new Date(factura.fechaEmision);
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

    // Rangos de montos
    const rangos = [
      { label: '< $100K', min: 0, max: 100000 },
      { label: '$100K - $500K', min: 100000, max: 500000 },
      { label: '$500K - $1M', min: 500000, max: 1000000 },
      { label: '$1M - $5M', min: 1000000, max: 5000000 },
      { label: '> $5M', min: 5000000, max: Infinity }
    ];

    const cantidadesPorRango = rangos.map(rango => 
      this.facturas.filter(f => {
        const monto = f.montoTotal || 0;
        return monto >= rango.min && monto < rango.max;
      }).length
    );

    this.montosChart = new Chart(this.montosChartCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: rangos.map(r => r.label),
        datasets: [{
          data: cantidadesPorRango,
          backgroundColor: [
            '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981'
          ],
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              padding: 15,
              usePointStyle: true,
              font: { size: 10 }
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
                return `${label}: ${value} facturas (${percentage}%)`;
              }
            }
          }
        },
        layout: { padding: 10 }
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
    
    this.facturas.forEach((f) => {
      const rut = this.getRutFromFactura(f);
      const nombre = this.getNombreProveedor(f);
      const clave = rut && rut !== '-' ? rut : nombre;
      const monto = Number(f['Monto Total'] || f.monto || f.total || f['Monto Neto'] || 0);
      
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
      const monto = Number(f['Monto Total'] || f.monto || f.total || f['Monto Neto'] || 0);
      
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
    this.facturas.forEach(f => {
      const fecha = f.fechaRecepcion || f.fecha || f.fecha_recepcion || '';
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
    this.resumenEstados = estados.map(estado => ({
      estado,
      cantidad: this.facturas.filter(f => (f.estado || '').toLowerCase() === estado.toLowerCase()).length
    }));
  }

  calcularResumenPorDia(): void {
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

  getFacturasFiltradas(): any[] {
    return this.facturas;
  }

  exportarExcel() {
    const facturasFiltradas = this.getFacturasFiltradas();
    if (!facturasFiltradas || facturasFiltradas.length === 0) return;
    const fechaHoy = new Date();
    const fechaStr = fechaHoy.toISOString().slice(0, 10);
    const nombreArchivo = `facturas_filtradas_${fechaStr}.xlsx`;
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
    console.log('Abrir modal de filtros');
  }

  verDetalleProveedor(proveedor: any): void {
    console.log('Ver detalle de proveedor:', proveedor);
  }

  filtrarPorProveedor(proveedor: any): void {
    console.log('Filtrar por proveedor:', proveedor);
  }

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
    return this.montosPorProveedor.reduce((acc, monto) => acc + monto, 0);
  }

  getFacturasPorVencerCount(): number {
    return this.facturas.filter(f => this.esPorVencer(f['Fecha Docto.'] || f.fechaEmision || '')).length;
  }

  esPorVencer(fechaDocto: string): boolean {
    if (!fechaDocto) return false;
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

  getPercentage(cantidad: number): string {
    const total = this.resumenEstados.reduce((sum, item) => sum + item.cantidad, 0);
    return total > 0 ? ((cantidad / total) * 100).toFixed(1) : '0';
  }

  getProveedorPorcentaje(monto: number): string {
    const total = this.getMontoTotalFacturacion();
    return total > 0 ? ((monto / total) * 100).toFixed(1) : '0';
  }
}