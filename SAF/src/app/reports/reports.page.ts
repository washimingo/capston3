import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonButtons, IonMenuButton } from '@ionic/angular/standalone';
import { DatabaseService } from '../services/database.service';
import Chart from 'chart.js/auto';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon,
    IonButtons, IonMenuButton
  ]
})
export class ReportsPage implements AfterViewInit {
  @ViewChild('barChartCanvas', { static: false }) barChartCanvas!: ElementRef;
  chart: any;
  resumenEstados: { estado: string, cantidad: number }[] = [];
  facturas: any[] = [];

  constructor(private db: DatabaseService) {}

  async ngAfterViewInit() {
    await this.cargarDatos();
    this.generarGrafico();
  }

  async cargarDatos() {
    this.facturas = await this.db.getFacturas();
    const estados = ['Pendiente', 'Aceptada', 'Rechazada', 'Vencida'];
    this.resumenEstados = estados.map(estado => ({
      estado,
      cantidad: this.facturas.filter(f => (f.estado || '').toLowerCase() === estado.toLowerCase()).length
    }));
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
