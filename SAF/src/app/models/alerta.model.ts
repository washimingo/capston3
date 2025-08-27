export interface Alerta {
  id: string;
  facturaId: string;
  tipo: 'D0' | 'D3' | 'D6' | 'D7' | 'D8';
  fechaProgramada: Date;
  destinatarios: string[]; // emails o IDs de usuario
  estadoEnvio: 'pendiente' | 'enviada' | 'escalada';
}
