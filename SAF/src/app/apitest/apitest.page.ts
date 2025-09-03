import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner, IonButtons, IonMenuButton, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { Apisimulada } from '../services/api/apisimulada';
import { Factura } from '../interfaces/invoice/factura';

@Component({
  selector: 'app-apitest',
  templateUrl: './apitest.page.html',
  styleUrls: ['./apitest.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner, IonButtons, IonMenuButton, CommonModule, FormsModule]
})
export class ApitestPage implements OnInit {
  facturas: Factura[] = [];
  cargando = true;
  error: any = null;
  rawData: any = null;
  showModal = false;

  constructor(private apiSimulada: Apisimulada) { }

  ngOnInit() {
    this.cargarFacturas();
  }

  cargarFacturas() {
      this.apiSimulada.getFacturas().subscribe({
        next: (data) => {
          this.rawData = data;
          if (data && Array.isArray(data.facturas)) {
            this.facturas = data.facturas;
          } else if (Array.isArray(data)) {
            this.facturas = data;
          } else {
            this.facturas = [];
          }
          this.error = null;
          this.cargando = false;
        },
        error: (error) => {
          this.error = error;
          this.cargando = false;
        }
      });
  }

}
