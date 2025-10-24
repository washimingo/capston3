import { TestBed } from '@angular/core/testing';
import { PorVencerPipe } from './por-vencer-pipe';

describe('PorVencerPipe', () => {
  let pipe: PorVencerPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PorVencerPipe]
    });
    pipe = TestBed.inject(PorVencerPipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('debería retornar array vacío si la entrada no es un array', () => {
      expect(pipe.transform(null as any)).toEqual([]);
      expect(pipe.transform(undefined as any)).toEqual([]);
      expect(pipe.transform({} as any)).toEqual([]);
      expect(pipe.transform('string' as any)).toEqual([]);
    });

    it('debería retornar array vacío si el array está vacío', () => {
      expect(pipe.transform([])).toEqual([]);
    });

    it('debería filtrar facturas con estado "Por vencer"', () => {
      const facturas = [
        { id: 1, estado: 'Por vencer', monto: 1000 },
        { id: 2, estado: 'Pendiente', monto: 2000 },
        { id: 3, estado: 'Por Vencer', monto: 3000 }
      ];

      const resultado = pipe.transform(facturas);
      
      expect(resultado.length).toBe(2);
      expect(resultado[0].id).toBe(1);
      expect(resultado[1].id).toBe(3);
    });

    it('debería ser case-insensitive al filtrar por estado', () => {
      const facturas = [
        { id: 1, estado: 'por vencer', monto: 1000 },
        { id: 2, estado: 'POR VENCER', monto: 2000 },
        { id: 3, estado: 'Por Vencer', monto: 3000 }
      ];

      const resultado = pipe.transform(facturas);
      
      expect(resultado.length).toBe(3);
    });

    it('debería filtrar facturas con fecha de vencimiento en los próximos 7 días', () => {
      const hoy = new Date();
      const en3Dias = new Date(hoy);
      en3Dias.setDate(en3Dias.getDate() + 3);
      
      const en5Dias = new Date(hoy);
      en5Dias.setDate(en5Dias.getDate() + 5);

      const facturas = [
        { id: 1, fechaVencimiento: en3Dias.toISOString(), monto: 1000 },
        { id: 2, fechaVencimiento: en5Dias.toISOString(), monto: 2000 }
      ];

      const resultado = pipe.transform(facturas);
      
      expect(resultado.length).toBe(2);
    });

    it('debería excluir facturas con fecha de vencimiento mayor a 7 días', () => {
      const hoy = new Date();
      const en10Dias = new Date(hoy);
      en10Dias.setDate(en10Dias.getDate() + 10);

      const en15Dias = new Date(hoy);
      en15Dias.setDate(en15Dias.getDate() + 15);

      const facturas = [
        { id: 1, fechaVencimiento: en10Dias.toISOString(), monto: 1000 },
        { id: 2, fechaVencimiento: en15Dias.toISOString(), monto: 2000 }
      ];

      const resultado = pipe.transform(facturas);
      
      expect(resultado.length).toBe(0);
    });

    it('debería incluir facturas con fecha de vencimiento hoy', () => {
      const hoy = new Date();

      const facturas = [
        { id: 1, fechaVencimiento: hoy.toISOString(), monto: 1000 }
      ];

      const resultado = pipe.transform(facturas);
      
      expect(resultado.length).toBe(1);
    });

    it('debería excluir facturas con fecha de vencimiento pasada', () => {
      const hoy = new Date();
      const ayer = new Date(hoy);
      ayer.setDate(ayer.getDate() - 1);

      const hace5Dias = new Date(hoy);
      hace5Dias.setDate(hace5Dias.getDate() - 5);

      const facturas = [
        { id: 1, fechaVencimiento: ayer.toISOString(), monto: 1000 },
        { id: 2, fechaVencimiento: hace5Dias.toISOString(), monto: 2000 }
      ];

      const resultado = pipe.transform(facturas);
      
      expect(resultado.length).toBe(0);
    });

    it('debería combinar filtros de estado y fecha', () => {
      const hoy = new Date();
      const en3Dias = new Date(hoy);
      en3Dias.setDate(en3Dias.getDate() + 3);

      const en10Dias = new Date(hoy);
      en10Dias.setDate(en10Dias.getDate() + 10);

      const facturas = [
        { id: 1, estado: 'Por vencer', monto: 1000 },
        { id: 2, fechaVencimiento: en3Dias.toISOString(), monto: 2000 },
        { id: 3, fechaVencimiento: en10Dias.toISOString(), monto: 3000 },
        { id: 4, estado: 'Pendiente', monto: 4000 }
      ];

      const resultado = pipe.transform(facturas);
      
      expect(resultado.length).toBe(2);
      expect(resultado.some(f => f.id === 1)).toBe(true);
      expect(resultado.some(f => f.id === 2)).toBe(true);
    });

    it('debería manejar facturas sin estado ni fecha de vencimiento', () => {
      const facturas = [
        { id: 1, monto: 1000 },
        { id: 2, monto: 2000 }
      ];

      const resultado = pipe.transform(facturas);
      
      expect(resultado.length).toBe(0);
    });

    it('debería manejar fechas de vencimiento inválidas', () => {
      const facturas = [
        { id: 1, fechaVencimiento: 'fecha-invalida', monto: 1000 },
        { id: 2, fechaVencimiento: null, monto: 2000 },
        { id: 3, fechaVencimiento: undefined, monto: 3000 }
      ];

      const resultado = pipe.transform(facturas);
      
      expect(resultado.length).toBe(0);
    });

    it('debería incluir facturas exactamente a 7 días de vencer', () => {
      const hoy = new Date();
      const en7Dias = new Date(hoy);
      en7Dias.setDate(en7Dias.getDate() + 7);

      const facturas = [
        { id: 1, fechaVencimiento: en7Dias.toISOString(), monto: 1000 }
      ];

      const resultado = pipe.transform(facturas);
      
      expect(resultado.length).toBe(1);
    });

    it('debería preservar el orden original de las facturas', () => {
      const hoy = new Date();
      const en2Dias = new Date(hoy);
      en2Dias.setDate(en2Dias.getDate() + 2);

      const en4Dias = new Date(hoy);
      en4Dias.setDate(en4Dias.getDate() + 4);

      const facturas = [
        { id: 1, fechaVencimiento: en4Dias.toISOString(), monto: 1000 },
        { id: 2, fechaVencimiento: en2Dias.toISOString(), monto: 2000 }
      ];

      const resultado = pipe.transform(facturas);
      
      expect(resultado[0].id).toBe(1);
      expect(resultado[1].id).toBe(2);
    });
  });
});
