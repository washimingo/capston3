# 🔄 Integrar Facturas del SII con tu Página Actual

Esta guía te muestra cómo integrar las facturas consultadas del SII con tu página de facturas existente (`invoices.page.ts`).

## 📋 Opción 1: Botón de Sincronización Simple

Agrega un botón para sincronizar facturas del SII en tu página actual.

### 1. Importar el servicio en `invoices.page.ts`

```typescript
import { SiiBackendService } from 'src/app/services/sii/sii-backend.service';

constructor(
  // ... tus constructores existentes
  private siiBackend: SiiBackendService
) {}
```

### 2. Agregar método de sincronización

```typescript
async sincronizarConSII() {
  const loading = await this.loadingController.create({
    message: 'Sincronizando con SII...',
  });
  await loading.present();

  try {
    // Consultar últimos 30 días
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    const params = {
      fechaDesde: this.formatFechaSII(hace30Dias),
      fechaHasta: this.formatFechaSII(hoy)
    };

    this.siiBackend.consultarFacturas(params).subscribe({
      next: async (response) => {
        // Parsear respuesta XML
        const facturasSII = this.parsearFacturasSII(response.data);
        
        // Guardar en tu base de datos
        await this.guardarFacturasEnDB(facturasSII);
        
        // Recargar la lista
        await this.cargarFacturas();
        
        loading.dismiss();
        this.mostrarToast(
          `✅ Se sincronizaron ${facturasSII.length} facturas`,
          'success'
        );
      },
      error: (error) => {
        console.error('Error sincronizando:', error);
        loading.dismiss();
        this.mostrarToast('❌ Error al sincronizar con SII', 'danger');
      }
    });
  } catch (error) {
    loading.dismiss();
    this.mostrarToast('❌ Error al sincronizar', 'danger');
  }
}

// Formato de fecha para el SII: YYYYMMDD
formatFechaSII(fecha: Date): string {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// Parsear XML del SII a objetos Factura
parsearFacturasSII(xmlData: string): any[] {
  const facturas: any[] = [];
  
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, 'text/xml');
    const documentos = xmlDoc.getElementsByTagName('Documento');
    
    for (let i = 0; i < documentos.length; i++) {
      const doc = documentos[i];
      
      facturas.push({
        numeroFactura: this.getXMLValue(doc, 'Folio'),
        receptor: this.getXMLValue(doc, 'RutReceptor'),
        fecha: this.getXMLValue(doc, 'FchEmis'),
        total: parseFloat(this.getXMLValue(doc, 'MntTotal') || '0'),
        estado: this.mapearEstadoSII(this.getXMLValue(doc, 'Estado')),
        origen: 'SII' // Marcar que vino del SII
      });
    }
  } catch (error) {
    console.error('Error parseando XML:', error);
  }
  
  return facturas;
}

getXMLValue(parent: any, tagName: string): string {
  const element = parent.getElementsByTagName(tagName)[0];
  return element ? element.textContent || '' : '';
}

// Mapear estados del SII a tus estados
mapearEstadoSII(estadoSII: string): string {
  const mapeo: { [key: string]: string } = {
    'ACD': 'aceptada',
    'RCD': 'rechazada',
    'RSC': 'pendiente',
    'RFR': 'rechazada'
  };
  return mapeo[estadoSII] || 'pendiente';
}

// Guardar facturas en tu DB local
async guardarFacturasEnDB(facturas: any[]) {
  for (const factura of facturas) {
    try {
      // Verificar si ya existe
      const existe = await this.dbService.existeFactura(factura.numeroFactura);
      
      if (!existe) {
        await this.dbService.agregarFactura(factura);
        console.log(`✅ Factura ${factura.numeroFactura} guardada`);
      } else {
        // Actualizar estado si cambió
        await this.dbService.actualizarEstado(
          factura.numeroFactura,
          factura.estado
        );
        console.log(`🔄 Factura ${factura.numeroFactura} actualizada`);
      }
    } catch (error) {
      console.error(`Error guardando factura ${factura.numeroFactura}:`, error);
    }
  }
}
```

### 3. Agregar botón en el HTML (`invoices.page.html`)

Busca donde tienes tus botones de acción y agrega:

```html
<!-- Botón de sincronización con SII -->
<ion-button 
  (click)="sincronizarConSII()" 
  fill="outline" 
  color="primary">
  <ion-icon slot="start" name="cloud-download-outline"></ion-icon>
  Sincronizar con SII
</ion-button>
```

O como un ítem en tu menú de opciones:

```html
<ion-item button (click)="sincronizarConSII()">
  <ion-icon name="cloud-download-outline" slot="start"></ion-icon>
  <ion-label>Sincronizar con SII</ion-label>
</ion-item>
```

## 📋 Opción 2: Sincronización Automática Periódica

Si quieres que la sincronización sea automática cada cierto tiempo:

```typescript
import { interval, Subscription } from 'rxjs';

// En tu clase
private sincronizacionSubscription?: Subscription;

ngOnInit() {
  // ... tu código existente
  
  // Sincronizar cada hora (3600000 ms)
  this.sincronizacionSubscription = interval(3600000).subscribe(() => {
    this.sincronizarConSIISilencioso();
  });
  
  // Sincronización inicial
  this.sincronizarConSIISilencioso();
}

ngOnDestroy() {
  // Limpiar subscripción
  if (this.sincronizacionSubscription) {
    this.sincronizacionSubscription.unsubscribe();
  }
}

// Sincronización sin mostrar loading (silenciosa)
async sincronizarConSIISilencioso() {
  try {
    const hoy = new Date();
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);

    const params = {
      fechaDesde: this.formatFechaSII(ayer),
      fechaHasta: this.formatFechaSII(hoy)
    };

    this.siiBackend.consultarFacturas(params).subscribe({
      next: async (response) => {
        const facturasSII = this.parsearFacturasSII(response.data);
        if (facturasSII.length > 0) {
          await this.guardarFacturasEnDB(facturasSII);
          await this.cargarFacturas();
          console.log(`✅ ${facturasSII.length} facturas sincronizadas automáticamente`);
        }
      },
      error: (error) => {
        console.error('Error en sincronización automática:', error);
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## 📋 Opción 3: Badge de "Nuevas Facturas"

Muestra un badge cuando hay facturas nuevas del SII:

```typescript
facturasNuevasSII: number = 0;

async verificarFacturasNuevas() {
  try {
    const hoy = new Date();
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);

    const params = {
      fechaDesde: this.formatFechaSII(ayer),
      fechaHasta: this.formatFechaSII(hoy)
    };

    this.siiBackend.consultarFacturas(params).subscribe({
      next: async (response) => {
        const facturasSII = this.parsearFacturasSII(response.data);
        
        // Contar cuántas son nuevas
        let nuevas = 0;
        for (const factura of facturasSII) {
          const existe = await this.dbService.existeFactura(factura.numeroFactura);
          if (!existe) nuevas++;
        }
        
        this.facturasNuevasSII = nuevas;
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }
}
```

En el HTML:

```html
<ion-button (click)="sincronizarConSII()">
  <ion-icon slot="start" name="cloud-download-outline"></ion-icon>
  Sincronizar con SII
  <ion-badge *ngIf="facturasNuevasSII > 0" color="danger">
    {{ facturasNuevasSII }}
  </ion-badge>
</ion-button>
```

## 🎨 Agregar Indicador Visual

Marca las facturas que vienen del SII con un ícono especial:

```html
<ion-item *ngFor="let factura of facturas">
  <ion-label>
    <h2>
      Factura #{{ factura.numeroFactura }}
      <!-- Badge si viene del SII -->
      <ion-chip *ngIf="factura.origen === 'SII'" color="primary" size="small">
        <ion-icon name="cloud-outline"></ion-icon>
        <ion-label>SII</ion-label>
      </ion-chip>
    </h2>
    <p>{{ factura.receptor }}</p>
    <p>{{ factura.fecha }} - ${{ factura.total }}</p>
  </ion-label>
</ion-item>
```

## 🔄 Métodos para tu Servicio de Base de Datos

Agrega estos métodos a tu servicio `Db` (si aún no los tienes):

```typescript
// En src/app/services/Database/db.ts

async existeFactura(numeroFactura: string): Promise<boolean> {
  const db = await this.getDatabase();
  const result = await db.query(
    'SELECT COUNT(*) as count FROM facturas WHERE numeroFactura = ?',
    [numeroFactura]
  );
  return result.values[0].count > 0;
}

async actualizarEstado(numeroFactura: string, estado: string): Promise<void> {
  const db = await this.getDatabase();
  await db.run(
    'UPDATE facturas SET estado = ? WHERE numeroFactura = ?',
    [estado, numeroFactura]
  );
}
```

## ✅ Checklist de Integración

- [ ] Importar `SiiBackendService` en `invoices.page.ts`
- [ ] Agregar método `sincronizarConSII()`
- [ ] Agregar método `parsearFacturasSII()`
- [ ] Agregar método `guardarFacturasEnDB()`
- [ ] Agregar botón en el HTML
- [ ] (Opcional) Implementar sincronización automática
- [ ] (Opcional) Agregar badge de nuevas facturas
- [ ] (Opcional) Agregar indicador visual para facturas del SII

## 🎯 Próximos Pasos Avanzados

1. **Notificaciones Push**: Alertar cuando lleguen nuevas facturas
2. **Logs de Sincronización**: Registrar cada sincronización
3. **Configuración de Frecuencia**: Permitir al usuario elegir cada cuánto sincronizar
4. **Filtros Avanzados**: Filtrar por tipo de DTE, estado, etc.
5. **Reconciliación**: Comparar facturas locales vs SII

---

¿Necesitas ayuda con alguna de estas opciones? Revisa los ejemplos y adapta el código a tu estructura existente. 🚀
