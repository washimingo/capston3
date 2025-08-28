import { Component, Input, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-facturas-por-estado-chart',
  template: `<canvas #chartCanvas></canvas>`,
  standalone: true
})
export class FacturasPorEstadoChartComponent implements AfterViewInit {
  @Input() data: { [estado: string]: number } = {};
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;
  chart: any;

  ngAfterViewInit() {
    this.renderChart();
  }

  renderChart() {
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
            '#ffc409', // warning
            '#2dd36f', // success
            '#eb445a', // danger
            '#3dc2ff', // info
            '#7044ff', // secondary
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
  }
}
