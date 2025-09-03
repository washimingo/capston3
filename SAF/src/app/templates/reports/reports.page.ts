import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonMenuButton, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Db } from 'src/app/services/database/db';
import { Chart } from 'chart.js';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonMenuButton, IonButtons, IonIcon, IonButton, IonCardContent, IonCardTitle, IonCardHeader, IonCard]
})
export class ReportsPage implements AfterViewInit {
  @ViewChild('barChartCanvas', { static: false }) barChartCanvas!: ElementRef;
  chart: any;
  resumenEstados: { estado: string, cantidad: number }[] = [];
  facturas: any[] = [];
  resumenPorDia: { fecha: string, cantidad: number }[] = [];

  constructor(private db: Db, private router: Router) {}

  async ngAfterViewInit() {
    await this.cargarDatos();
    this.generarGrafico();
    this.generarGraficoPorDia();
  }

  async cargarDatos() {
    this.facturas = await this.db.getFacturas();
    const estados = ['Pendiente', 'Aceptada', 'Rechazada', 'Vencida'];
    this.resumenEstados = estados.map(estado => ({
      estado,
      cantidad: this.facturas.filter(f => (f.estado || '').toLowerCase() === estado.toLowerCase()).length
    }));
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
  }
  graficoPorDia: any;
  generarGraficoPorDia() {
    if (this.graficoPorDia) {
      this.graficoPorDia.destroy();
    }
    const ctx = document.getElementById('barChartPorDia') as HTMLCanvasElement;
    if (!ctx) return;
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
  }

  generarGrafico() {
    if (this.chart) {
      this.chart.destroy();
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
  }

  exportarExcel() {
    if (!this.facturas || this.facturas.length === 0) return;
    const data = this.facturas.map(f => ({
      Folio: f.folio,
      Proveedor: f.proveedor,
      Tipo: f.tipo,
      Responsable: f.responsable,
      Monto: f.monto,
      FechaRecepcion: f.fechaRecepcion || f.fecha,
      Estado: f.estado,
      Comentario: f.comentario || '',
      MensajeAlerta: f.mensajeAlerta || ''
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Facturas');
    XLSX.writeFile(wb, 'facturas_completas.xlsx');
  }

  exportarPDF() {
    if (!this.facturas || this.facturas.length === 0) return;
    const doc = new jsPDF({ orientation: 'landscape' });
    const columns = [
      'Folio', 'Proveedor', 'Tipo', 'Responsable', 'Monto', 'FechaRecepcion', 'Estado', 'Comentario', 'MensajeAlerta'
    ];
    const rows = this.facturas.map(f => [
      f.folio,
      f.proveedor,
      f.tipo,
      f.responsable,
      f.monto,
      f.fechaRecepcion || f.fecha,
      f.estado,
      f.comentario || '',
      f.mensajeAlerta || ''
    ]);
    autoTable(doc, {
      head: [columns],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [123, 38, 58] },
      styles: { fontSize: 8, cellWidth: 'wrap', halign: 'center' },
      margin: { top: 20 }
    });
    doc.save('facturas_completas.pdf');
  }
}
