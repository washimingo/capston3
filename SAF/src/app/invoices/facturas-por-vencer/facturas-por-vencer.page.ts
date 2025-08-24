import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge
} from '@ionic/angular/standalone';

// 1. Definir la interfaz Factura
interface Factura {
  id: number;
  folio: string;
  fechaRecepcion: string;
  proveedor: string;
  monto: number;
  tipo: string;
  estado: string;
  responsable: string;
  comentario: string;
  diasDesdeRecepcion: number;
  mensajeAlerta: string;
}

@Component({
  selector: 'app-facturas-por-vencer',
  templateUrl: './facturas-por-vencer.page.html',
  styleUrls: ['./facturas-por-vencer.page.scss'],
  standalone: true,
  // 2. Importar todos los componentes de Ionic necesarios
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonBadge
  ]
})
export class FacturasPorVencerPage {
  facturas: Factura[] = [
    {
      id: 21,
      folio: 'F021-2025',
      fechaRecepcion: '15/8/2025',
      proveedor: 'Logística Norte',
      monto: 230000,
      tipo: 'Contrato',
      estado: 'Recibida',
      responsable: 'Pedro',
      comentario: '',
      diasDesdeRecepcion: 6,
      mensajeAlerta: 'Por vencer en 2 días'
    },
    {
      id: 22,
      folio: 'F022-2025',
      fechaRecepcion: '15/8/2025',
      proveedor: 'Servicios Ltda.',
      monto: 660000,
      tipo: 'OC',
      estado: 'Recibida',
      responsable: 'Laura',
      comentario: '',
      diasDesdeRecepcion: 6,
      mensajeAlerta: 'Por vencer en 2 días'
    },
    {
      id: 23,
      folio: 'F023-2025',
      fechaRecepcion: '15/8/2025',
      proveedor: 'Expertec Ltda.',
      monto: 710000,
      tipo: 'Contrato',
      estado: 'Recibida',
      responsable: 'Carla',
      comentario: '',
      diasDesdeRecepcion: 6,
      mensajeAlerta: 'Por vencer en 2 días'
    },
    {
      id: 19,
      folio: 'F019-2025',
      fechaRecepcion: '14/8/2025',
      proveedor: 'Servicios Ltda.',
      monto: 475000,
      tipo: 'Contrato',
      estado: 'Recibida',
      responsable: 'Luis',
      comentario: '',
      diasDesdeRecepcion: 7,
      mensajeAlerta: 'Por vencer en 1 día'
    },
    {
      id: 1,
      folio: 'F001-2025',
      fechaRecepcion: '1/8/2025',
      proveedor: 'Servicios Ltda.',
      monto: 500000,
      tipo: 'OC',
      estado: 'Recibida',
      responsable: 'Carla',
      comentario: '',
      diasDesdeRecepcion: 20,
      mensajeAlerta: 'Factura VENCIDA'
    }
    // Agrega más si lo deseas
  ];

  facturaSeleccionada?: Factura;

  seleccionarFactura(factura: Factura) {
    this.facturaSeleccionada = factura;
  }

  getColorPorAlerta(factura: Factura): string {
    if (factura.mensajeAlerta.includes('VENCIDA')) return 'danger';
    if (factura.mensajeAlerta.includes('Por vencer')) return 'warning';
    return 'medium';
  }
}