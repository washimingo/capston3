import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner, IonButtons, IonMenuButton } from '@ionic/angular/standalone';
import { Apisimulada } from 'src/app/services/api/apisimulada';
import { Factura } from 'src/app/interfaces/invoice/factura';

@Component({
  selector: 'app-test-api',
  templateUrl: './test-api.page.html',
  styleUrls: ['./test-api.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner, IonButtons, IonMenuButton, CommonModule, FormsModule]
})
export class TestApiPage implements OnInit {
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
