import { Injectable } from '@angular/core';
import { Alerta } from '../models/alerta.model';

@Injectable({ providedIn: 'root' })
export class AlertasService {
  private alertas: Alerta[] = [];

  programarAlertasParaFactura(facturaId: string, fechaRecepcion: Date, destinatarios: string[]) {
    const dias = [0, 3, 6, 7, 8];
    dias.forEach(dia => {
      const fecha = new Date(fechaRecepcion);
      fecha.setDate(fecha.getDate() + dia);
      this.alertas.push({
        id: this.generarId(),
        facturaId,
        tipo: `D${dia}` as any,
        fechaProgramada: fecha,
        destinatarios,
        estadoEnvio: 'pendiente'
      });
    });
  }

  revisarYEnviarAlertas() {
    const hoy = new Date();
    this.alertas.forEach(alerta => {
      if (alerta.estadoEnvio === 'pendiente' && this.esHoy(alerta.fechaProgramada, hoy)) {
        this.enviarNotificacion(alerta);
        alerta.estadoEnvio = 'enviada';
        // Si es D8 y no hay respuesta, escalar
        if (alerta.tipo === 'D8') {
          this.escalarAlerta(alerta);
        }
      }
    });
  }

  private enviarNotificacion(alerta: Alerta) {
    // Aquí puedes mostrar un toast, enviar email, etc.
    console.log(`Enviando alerta ${alerta.tipo} para factura ${alerta.facturaId}`);
  }

  private escalarAlerta(alerta: Alerta) {
    // Lógica para notificar a la jefatura/dirección
    alerta.estadoEnvio = 'escalada';
    console.log(`Escalando alerta de factura ${alerta.facturaId} a dirección`);
  }

  private esHoy(fecha: Date, hoy: Date): boolean {
    return fecha.toDateString() === hoy.toDateString();
  }

  private generarId(): string {
    return Math.random().toString(36).substring(2, 10);
  }
}
