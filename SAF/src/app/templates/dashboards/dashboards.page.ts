import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Db } from 'src/app/services/database/db';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.page.html',
  styleUrls: ['./dashboards.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonMenuButton, IonButtons]
})
export class DashboardsPage implements OnInit {
  @ViewChild('barChartCanvas', { static: false }) barChartCanvas!: ElementRef;
  @ViewChild('lineChartCanvas', { static: false }) lineChartCanvas!: ElementRef;
  facturas: any[] = [];
  proveedores: string[] = [];
  montosPorProveedor: number[] = [];
  barChart: any;
  lineChart: any;
  meses: string[] = [];
  cantidadPorMes: number[] = [];
  montoPorMes: number[] = [];

  constructor(private db: Db) {}

  async ngOnInit() {
    this.facturas = await this.db.getFacturas();
    this.calcularMontosPorProveedor();
    this.calcularEvolucionMensual();
  }

  ngAfterViewInit() {
    this.generarGraficoBarra();
    this.generarGraficoLinea();
  }

  calcularMontosPorProveedor() {
    const resumen: { [proveedor: string]: number } = {};
    this.facturas.forEach(f => {
      resumen[f.proveedor] = (resumen[f.proveedor] || 0) + f.monto;
    });
    this.proveedores = Object.keys(resumen);
    this.montosPorProveedor = Object.values(resumen);
  }

  calcularEvolucionMensual() {
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

  generarGraficoBarra() {
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

  generarGraficoLinea() {
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
            grid: { drawOnChartArea: false }
          }
        }
      }
    });
  }
}
