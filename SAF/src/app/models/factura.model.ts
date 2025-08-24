export interface Factura {
  id: number;
  folio: string;
  fechaRecepcion: string;
  proveedor: string;
  monto: number;
  tipo: string;
  estado: string;
  responsable: string;
  comentario?: string;
  diasDesdeRecepcion: number;
  mensajeAlerta: string;
}