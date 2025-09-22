import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-facturas-estado',
  template: `<canvas #chartCanvas></canvas>`,
  standalone: true
})
export class FacturasEstadoComponent  implements AfterViewInit {
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
