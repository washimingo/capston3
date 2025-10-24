import { TestBed } from '@angular/core/testing';
import { Alertas } from './alertas';
import { Factura } from 'src/app/models/factura.model';
import { Alerta } from 'src/app/models/alerta.model';

describe('Alertas Service', () => {
  let service: Alertas;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Alertas]
    });
    service = TestBed.inject(Alertas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generarAlertasPorFacturas', () => {
    it('debería generar alerta D0 para factura pendiente recibida hoy', () => {
      const hoy = new Date();
      const facturas: Factura[] = [{
        id: 1,
        folio: 'F001',
        fechaRecepcion: hoy.toISOString(),
        proveedor: 'Proveedor 1',
        monto: 1000,
        tipo: 'Compra',
        estado: 'pendiente',
        responsable: 'usuario@example.com',
        diasDesdeRecepcion: 0,
        mensajeAlerta: '',
        detalles: ''
      }];

      service.generarAlertasPorFacturas(facturas);
      const alertas = service.getAlertasPendientes('usuario@example.com');

      expect(alertas.length).toBeGreaterThan(0);
      expect(alertas[0].tipo).toBe('D0');
      expect(alertas[0].facturaId).toBe('1');
    });

    it('debería generar alerta D3 para factura pendiente con 3 días de antigüedad', () => {
      const hace3Dias = new Date();
      hace3Dias.setDate(hace3Dias.getDate() - 3);

      const facturas: Factura[] = [{
        id: 2,
        folio: 'F002',
        fechaRecepcion: hace3Dias.toISOString(),
        proveedor: 'Proveedor 2',
        monto: 2000,
        tipo: 'Compra',
        estado: 'pendiente',
        responsable: 'responsable@example.com',
        diasDesdeRecepcion: 3,
        mensajeAlerta: '',
        detalles: ''
      }];

      service.generarAlertasPorFacturas(facturas);
      const alertas = service.getAlertasPendientes('responsable@example.com');

      expect(alertas.length).toBeGreaterThan(0);
      const alertaD3 = alertas.find(a => a.tipo === 'D3');
      expect(alertaD3).toBeDefined();
      expect(alertaD3?.facturaId).toBe('2');
    });

    it('debería incluir jefatura en alerta D7', () => {
      const hace7Dias = new Date();
      hace7Dias.setDate(hace7Dias.getDate() - 7);

      const facturas: Factura[] = [{
        id: 3,
        folio: 'F003',
        fechaRecepcion: hace7Dias.toISOString(),
        proveedor: 'Proveedor 3',
        monto: 3000,
        tipo: 'Compra',
        estado: 'pendiente',
        responsable: 'responsable@example.com',
        diasDesdeRecepcion: 7,
        mensajeAlerta: '',
        detalles: ''
      }];

      service.generarAlertasPorFacturas(facturas);
      const alertas = service.getAlertasPendientes('jefatura');

      expect(alertas.length).toBeGreaterThan(0);
      const alertaD7 = alertas.find(a => a.tipo === 'D7');
      expect(alertaD7).toBeDefined();
      expect(alertaD7?.destinatarios).toContain('jefatura');
    });

    it('debería incluir dirección en alerta D8', () => {
      const hace8Dias = new Date();
      hace8Dias.setDate(hace8Dias.getDate() - 8);

      const facturas: Factura[] = [{
        id: 4,
        folio: 'F004',
        fechaRecepcion: hace8Dias.toISOString(),
        proveedor: 'Proveedor 4',
        monto: 4000,
        tipo: 'Compra',
        estado: 'pendiente',
        responsable: 'responsable@example.com',
        diasDesdeRecepcion: 8,
        mensajeAlerta: '',
        detalles: ''
      }];

      service.generarAlertasPorFacturas(facturas);
      const alertas = service.getAlertasPendientes('direccion');

      expect(alertas.length).toBeGreaterThan(0);
      const alertaD8 = alertas.find(a => a.tipo === 'D8');
      expect(alertaD8).toBeDefined();
      expect(alertaD8?.destinatarios).toContain('direccion');
    });

    it('no debería generar alertas para facturas no pendientes', () => {
      const hoy = new Date();
      const facturas: Factura[] = [{
        id: 5,
        folio: 'F005',
        fechaRecepcion: hoy.toISOString(),
        proveedor: 'Proveedor 5',
        monto: 5000,
        tipo: 'Compra',
        estado: 'aprobada',
        responsable: 'usuario@example.com',
        diasDesdeRecepcion: 0,
        mensajeAlerta: '',
        detalles: ''
      }];

      const alertasIniciales = service.getAlertasPendientes('usuario@example.com');
      const cantidadInicial = alertasIniciales.length;

      service.generarAlertasPorFacturas(facturas);
      const alertasFinales = service.getAlertasPendientes('usuario@example.com');

      expect(alertasFinales.length).toBe(cantidadInicial);
    });

    it('no debería generar alertas duplicadas para la misma factura y día', () => {
      const hoy = new Date();
      const facturas: Factura[] = [{
        id: 6,
        folio: 'F006',
        fechaRecepcion: hoy.toISOString(),
        proveedor: 'Proveedor 6',
        monto: 6000,
        tipo: 'Compra',
        estado: 'pendiente',
        responsable: 'usuario@example.com',
        diasDesdeRecepcion: 0,
        mensajeAlerta: '',
        detalles: ''
      }];

      service.generarAlertasPorFacturas(facturas);
      const alertas1 = service.getAlertasPendientes('usuario@example.com');
      const cantidad1 = alertas1.length;

      service.generarAlertasPorFacturas(facturas);
      const alertas2 = service.getAlertasPendientes('usuario@example.com');

      expect(alertas2.length).toBe(cantidad1);
    });
  });

  describe('programarAlertasParaFactura', () => {
    it('debería programar 5 alertas (D0, D3, D6, D7, D8)', () => {
      const fechaRecepcion = new Date();
      service.programarAlertasParaFactura('F100', fechaRecepcion, ['usuario@example.com']);

      const alertasUsuario = service.getAlertasPendientes('usuario@example.com');
      const alertasFactura = alertasUsuario.filter(a => a.facturaId === 'F100');

      expect(alertasFactura.length).toBe(5);
    });

    it('debería programar alertas con fechas correctas', () => {
      const fechaRecepcion = new Date('2025-01-01');
      service.programarAlertasParaFactura('F101', fechaRecepcion, ['usuario@example.com']);

      const alertasUsuario = service.getAlertasPendientes('usuario@example.com');
      const alertasFactura = alertasUsuario.filter(a => a.facturaId === 'F101');

      const alertaD3 = alertasFactura.find(a => a.tipo === 'D3');
      expect(alertaD3).toBeDefined();
      
      const fechaEsperada = new Date('2025-01-04');
      const fechaProgramada = new Date(alertaD3!.fechaProgramada);
      expect(fechaProgramada.toDateString()).toBe(fechaEsperada.toDateString());
    });
  });

  describe('marcarAlertaComoEnviada', () => {
    it('debería cambiar el estado de una alerta a enviada', () => {
      const fechaRecepcion = new Date();
      service.programarAlertasParaFactura('F200', fechaRecepcion, ['usuario@example.com']);

      const alertas = service.getAlertasPendientes('usuario@example.com');
      const alerta = alertas.find(a => a.facturaId === 'F200');
      
      expect(alerta).toBeDefined();
      expect(alerta!.estadoEnvio).toBe('pendiente');

      service.marcarAlertaComoEnviada(alerta!.id);
      const alertasActualizadas = service.getAlertasPendientes('usuario@example.com');
      const alertaActualizada = alertasActualizadas.find(a => a.id === alerta!.id);

      expect(alertaActualizada).toBeUndefined();
    });
  });

  describe('getAlertasPendientes', () => {
    it('debería retornar solo alertas pendientes del usuario', () => {
      const fechaRecepcion = new Date();
      service.programarAlertasParaFactura('F300', fechaRecepcion, ['usuario1@example.com']);
      service.programarAlertasParaFactura('F301', fechaRecepcion, ['usuario2@example.com']);

      const alertasUsuario1 = service.getAlertasPendientes('usuario1@example.com');
      const alertasUsuario2 = service.getAlertasPendientes('usuario2@example.com');

      expect(alertasUsuario1.length).toBeGreaterThan(0);
      expect(alertasUsuario2.length).toBeGreaterThan(0);
      
      alertasUsuario1.forEach(a => {
        expect(a.destinatarios).toContain('usuario1@example.com');
      });
    });

    it('debería retornar array vacío si no hay alertas para el usuario', () => {
      const alertas = service.getAlertasPendientes('usuario-inexistente@example.com');
      expect(alertas).toEqual([]);
    });
  });
});
