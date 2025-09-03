// Interfaz de Factura API
export interface Factura {
    id: string;
    folio: number;
    rutEmisor: string;
    razonSocialEmisor: string;
    montoTotal: number;
    fechaEmision: string;
    estado: string;
}