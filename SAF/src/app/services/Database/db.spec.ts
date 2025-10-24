import { TestBed } from '@angular/core/testing';
import { Db } from './db';

describe('Db Service', () => {
  let service: Db;
  let mockIndexedDB: any;

  beforeEach(() => {
    // Mock IndexedDB
    mockIndexedDB = {
      databases: new Map(),
      open: jasmine.createSpy('open').and.callFake((name: string, version: number) => {
        const request: any = {
          onsuccess: null,
          onerror: null,
          onupgradeneeded: null,
          result: null
        };

        setTimeout(() => {
          const db: any = {
            objectStoreNames: {
              contains: (storeName: string) => mockIndexedDB.databases.has(storeName)
            },
            createObjectStore: (name: string, options: any) => {
              mockIndexedDB.databases.set(name, {
                data: new Map(),
                keyPath: options.keyPath,
                autoIncrement: options.autoIncrement
              });
              return {};
            },
            transaction: (storeNames: string | string[], mode: string) => {
              const stores = Array.isArray(storeNames) ? storeNames : [storeNames];
              return {
                objectStore: (name: string) => {
                  const store = mockIndexedDB.databases.get(name);
                  return {
                    add: jasmine.createSpy('add').and.callFake((data: any) => {
                      const addRequest: any = {
                        onsuccess: null,
                        onerror: null,
                        result: null
                      };
                      setTimeout(() => {
                        const id = data[store.keyPath] || store.data.size + 1;
                        store.data.set(id, data);
                        addRequest.result = id;
                        if (addRequest.onsuccess) addRequest.onsuccess({ target: { result: id } });
                      }, 0);
                      return addRequest;
                    }),
                    get: jasmine.createSpy('get').and.callFake((id: any) => {
                      const getRequest: any = {
                        onsuccess: null,
                        onerror: null,
                        result: null
                      };
                      setTimeout(() => {
                        getRequest.result = store.data.get(id);
                        if (getRequest.onsuccess) getRequest.onsuccess();
                      }, 0);
                      return getRequest;
                    }),
                    put: jasmine.createSpy('put').and.callFake((data: any) => {
                      const putRequest: any = {
                        onsuccess: null,
                        onerror: null
                      };
                      setTimeout(() => {
                        const id = data[store.keyPath];
                        store.data.set(id, data);
                        if (putRequest.onsuccess) putRequest.onsuccess();
                      }, 0);
                      return putRequest;
                    }),
                    delete: jasmine.createSpy('delete').and.callFake((id: any) => {
                      const deleteRequest: any = {
                        onsuccess: null,
                        onerror: null
                      };
                      setTimeout(() => {
                        store.data.delete(id);
                        if (deleteRequest.onsuccess) deleteRequest.onsuccess();
                      }, 0);
                      return deleteRequest;
                    }),
                    getAll: jasmine.createSpy('getAll').and.callFake(() => {
                      const getAllRequest: any = {
                        onsuccess: null,
                        onerror: null,
                        result: null
                      };
                      setTimeout(() => {
                        getAllRequest.result = Array.from(store.data.values());
                        if (getAllRequest.onsuccess) getAllRequest.onsuccess();
                      }, 0);
                      return getAllRequest;
                    })
                  };
                }
              };
            }
          };

          request.result = db;
          if (request.onupgradeneeded) {
            request.onupgradeneeded({ target: { result: db } });
          }
          if (request.onsuccess) {
            request.onsuccess();
          }
        }, 0);

        return request;
      })
    };

    // Mock global indexedDB
    (window as any).indexedDB = mockIndexedDB;

    TestBed.configureTestingModule({
      providers: [Db]
    });
    service = TestBed.inject(Db);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addFactura', () => {
    it('debería agregar una factura correctamente', async () => {
      const factura = {
        folio: 'F001',
        fechaRecepcion: '2025-01-01',
        proveedor: 'Proveedor Test',
        monto: 1000,
        estado: 'pendiente'
      };

      const id = await service.addFactura(factura);
      expect(id).toBeDefined();
      expect(typeof id).toBe('number');
    });

    it('debería agregar factura con bitácora', async () => {
      const factura = {
        folio: 'F002',
        fechaRecepcion: '2025-01-02',
        proveedor: 'Proveedor 2',
        monto: 2000,
        estado: 'pendiente',
        bitacora: [
          { usuario: 'admin', accion: 'Creación', fecha: new Date() }
        ]
      };

      const id = await service.addFactura(factura);
      expect(id).toBeDefined();
    });
  });

  describe('getFacturas', () => {
    it('debería retornar todas las facturas', async () => {
      const factura1 = { folio: 'F001', monto: 1000 };
      const factura2 = { folio: 'F002', monto: 2000 };

      await service.addFactura(factura1);
      await service.addFactura(factura2);

      const facturas = await service.getFacturas();
      expect(facturas.length).toBeGreaterThanOrEqual(2);
    });

    it('debería retornar array vacío si no hay facturas', async () => {
      const facturas = await service.getFacturas();
      expect(Array.isArray(facturas)).toBe(true);
    });
  });

  describe('updateFactura', () => {
    it('debería actualizar una factura existente', async () => {
      const factura = {
        folio: 'F003',
        monto: 3000,
        estado: 'pendiente'
      };

      const id = await service.addFactura(factura);
      
      await service.updateFactura(id as number, { estado: 'aprobada' });

      const facturas = await service.getFacturas();
      const facturaActualizada = facturas.find(f => f.id_factura === id);
      
      expect(facturaActualizada).toBeDefined();
      expect(facturaActualizada?.estado).toBe('aprobada');
    });
  });

  describe('deleteFactura', () => {
    it('debería eliminar una factura', async () => {
      const factura = {
        folio: 'F004',
        monto: 4000
      };

      const id = await service.addFactura(factura);
      await service.deleteFactura(id as number);

      const facturas = await service.getFacturas();
      const facturaEliminada = facturas.find(f => f.id_factura === id);
      
      expect(facturaEliminada).toBeUndefined();
    });
  });

  describe('cambiarEstadoFactura', () => {
    it('debería cambiar el estado y registrar en bitácora', async () => {
      const factura = {
        folio: 'F005',
        monto: 5000,
        estado: 'pendiente'
      };

      const id = await service.addFactura(factura);
      
      await service.cambiarEstadoFactura(
        id as number,
        'aprobada',
        'admin@example.com',
        'Aprobación manual'
      );

      const facturas = await service.getFacturas();
      const facturaActualizada = facturas.find(f => f.id_factura === id);
      
      expect(facturaActualizada?.estado).toBe('aprobada');

      const bitacora = await service.getBitacoraByFactura(id as number);
      expect(bitacora.length).toBeGreaterThan(0);
    });

    it('debería registrar en bitácora sin comentario', async () => {
      const factura = {
        folio: 'F006',
        monto: 6000,
        estado: 'pendiente'
      };

      const id = await service.addFactura(factura);
      
      await service.cambiarEstadoFactura(
        id as number,
        'rechazada',
        'revisor@example.com'
      );

      const bitacora = await service.getBitacoraByFactura(id as number);
      expect(bitacora.length).toBeGreaterThan(0);
      expect(bitacora[0].accion).toContain('rechazada');
    });
  });

  describe('getBitacoraByFactura', () => {
    it('debería retornar bitácora de una factura específica', async () => {
      const factura = {
        folio: 'F007',
        monto: 7000,
        estado: 'pendiente',
        bitacora: [
          { usuario: 'user1', accion: 'Creación', fecha: new Date() },
          { usuario: 'user2', accion: 'Revisión', fecha: new Date() }
        ]
      };

      const id = await service.addFactura(factura);
      const bitacora = await service.getBitacoraByFactura(id as number);

      expect(bitacora.length).toBeGreaterThanOrEqual(2);
    });

    it('debería retornar array vacío si no hay bitácora', async () => {
      const bitacora = await service.getBitacoraByFactura(99999);
      expect(bitacora).toEqual([]);
    });
  });
});
