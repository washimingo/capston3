import { AfterViewInit, Component, ElementRef, Input, ViewChild, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-facturas-estado',
  template: `<canvas #chartCanvas></canvas>`,
  standalone: true
})
export class FacturasEstadoComponent implements AfterViewInit, OnDestroy {
  @Input() data: { [estado: string]: number } = {};
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;
  chart: any;

  ngAfterViewInit() {
    this.renderChart();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  renderChart() {
    try {
      if (this.chart) {
        this.chart.destroy();
      }
      
      this.chart = new Chart(this.chartCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: Object.keys(this.data),
          datasets: [{
            label: 'Facturas por estado',
            data: Object.values(this.data),
            backgroundColor: [
              '#ffc409',
              '#2dd36f',
              '#eb445a',
              '#3dc2ff',
              '#7044ff',
            ],
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    } catch (error) {
      console.error('Error al crear el gráfico:', error);
    }
  }
}
