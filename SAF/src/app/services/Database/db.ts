import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Db {
  private dbName = 'saf_db';
  private dbVersion = 1;
  private dbPromise: Promise<IDBDatabase>;

  constructor() {
    this.dbPromise = this.openDB();
  }


  // Cambia el estado de una factura y agrega registro en bitácora
  async cambiarEstadoFactura(id_factura: number, nuevoEstado: string, usuario: string, comentario: string = ''): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['facturas', 'bitacora'], 'readwrite');
      const facturaStore = tx.objectStore('facturas');
      const bitacoraStore = tx.objectStore('bitacora');
      const getReq = facturaStore.get(id_factura);
      getReq.onsuccess = () => {
        const factura = { ...getReq.result, estado: nuevoEstado };
        facturaStore.put(factura);
        // Registrar en bitácora
        bitacoraStore.add({
          id_factura,
          usuario,
          accion: `Cambio de estado a ${nuevoEstado}` + (comentario ? `: ${comentario}` : ''),
          fecha: new Date()
        });
        resolve();
      };
      getReq.onerror = () => reject(getReq.error);
    });
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('facturas')) {
          const facturaStore = db.createObjectStore('facturas', { keyPath: 'id_factura', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('bitacora')) {
          const bitacoraStore = db.createObjectStore('bitacora', { keyPath: 'id', autoIncrement: true });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addFactura(factura: any): Promise<number | null> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['facturas', 'bitacora'], 'readwrite');
      const facturaStore = tx.objectStore('facturas');
      const bitacoraStore = tx.objectStore('bitacora');
      const facturaData = { ...factura };
      delete facturaData.bitacora;
      const req = facturaStore.add(facturaData);
      req.onsuccess = (e: any) => {
        const id_factura = e.target.result;
        if (factura.bitacora && factura.bitacora.length > 0) {
          for (const log of factura.bitacora) {
            bitacoraStore.add({ ...log, id_factura });
          }
        }
        resolve(id_factura);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async getFacturas(): Promise<any[]> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('facturas', 'readonly');
      const store = tx.objectStore('facturas');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async updateFactura(id_factura: number, changes: any): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('facturas', 'readwrite');
      const store = tx.objectStore('facturas');
      const getReq = store.get(id_factura);
      getReq.onsuccess = () => {
        const factura = { ...getReq.result, ...changes };
        const putReq = store.put(factura);
        putReq.onsuccess = () => resolve();
        putReq.onerror = () => reject(putReq.error);
      };
      getReq.onerror = () => reject(getReq.error);
    });
  }

  async deleteFactura(id_factura: number): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('facturas', 'readwrite');
      const store = tx.objectStore('facturas');
      const req = store.delete(id_factura);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // Métodos para bitácora
  async getBitacoraByFactura(id_factura: number): Promise<any[]> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('bitacora', 'readonly');
      const store = tx.objectStore('bitacora');
      const req = store.getAll();
      req.onsuccess = () => {
        const logs = req.result.filter((log: any) => log.id_factura === id_factura);
        resolve(logs);
      };
      req.onerror = () => reject(req.error);
    });
  }
}
