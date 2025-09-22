import { Injectable } from '@angular/core';
import { Alerta } from 'src/app/models/alerta.model';
import { Factura } from 'src/app/models/factura.model';

@Injectable({
  providedIn: 'root'
})
export class Alertas {
  private alertas: Alerta[] = [];

  // Recorre facturas y genera alertas según la lógica de negocio
  generarAlertasPorFacturas(facturas: Factura[]) {
    const hoy = new Date();
    facturas.forEach(factura => {
      if (factura.estado === 'pendiente') {
        const fechaRecepcion = new Date(factura.fechaRecepcion);
        const diasTranscurridos = this.diasTranscurridos(fechaRecepcion, hoy);
        const diasAlerta = [0, 3, 6, 7, 8];
        if (diasAlerta.includes(diasTranscurridos)) {
          const tipo = `D${diasTranscurridos}` as 'D0' | 'D3' | 'D6' | 'D7' | 'D8';
          // Verifica si ya existe una alerta enviada para este día y factura
          const yaEnviada = this.alertas.some(a => a.facturaId === factura.id.toString() && a.tipo === tipo);
          if (!yaEnviada) {
            // Determina destinatarios
            let destinatarios = [factura.responsable];
            if (tipo === 'D7') {
              destinatarios.push('jefatura'); // Reemplazar por email real de jefatura
            }
            if (tipo === 'D8') {
              destinatarios.push('direccion'); // Reemplazar por email real de dirección
            }
            // Crea y registra la alerta
            const alerta: Alerta = {
              id: this.generarId(),
              facturaId: factura.id.toString(),
              tipo,
              fechaProgramada: hoy,
              destinatarios,
              estadoEnvio: 'pendiente',
            };
            this.alertas.push(alerta);
            this.enviarNotificacion(alerta);
            if (tipo === 'D8') {
              this.escalarAlerta(alerta);
            }
          }
        }
      }
    });
  }

  private diasTranscurridos(fechaInicio: Date, fechaFin: Date): number {
    return Math.floor((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
  }

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
    this.playAlertaSonora();
  }

  private playAlertaSonora() {
    const audio = new Audio('assets/beep.mp3');
    audio.play().catch(e => console.warn('No se pudo reproducir el sonido de alerta:', e));
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

  // Obtiene las alertas pendientes para un usuario específico
  getAlertasPendientes(usuarioId: string): Alerta[] {
    return this.alertas.filter(
      alerta => alerta.destinatarios.includes(usuarioId) && alerta.estadoEnvio === 'pendiente'
    );
  }

  // Marca una alerta como enviada/leída
  marcarAlertaComoEnviada(alertaId: string) {
    const alerta = this.alertas.find(a => a.id === alertaId);
    if (alerta) {
      alerta.estadoEnvio = 'enviada';
    }
  }
}
