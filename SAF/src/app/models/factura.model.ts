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
  detalles: string;
  archivo?: string;
  url_archivo?: string;
  tipo_archivo?: string;
  bitacora?: any[]; // Se agrega como any[] para evitar error en el template
  cliente?: string;
  fecha?: string;
  motivoRechazo?: string;
  [key: string]: any;
}