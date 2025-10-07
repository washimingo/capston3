# 🚀 Guía Rápida de Inicio - Integración SII

## ⚡ Inicio Rápido en 5 Pasos

### 1️⃣ Instalar y Ejecutar el Backend

```bash
# Navegar a la carpeta del backend
cd backend-sii

# Instalar dependencias
npm install

# Iniciar el servidor
npm start
```

✅ El backend estará corriendo en `http://localhost:3000`

### 2️⃣ Configurar HttpClient en Angular

Edita `src/main.ts` y agrega:

```typescript
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... otros providers existentes
    provideHttpClient(withInterceptorsFromDi()),
  ]
};
```

### 3️⃣ Agregar Ruta al Componente SII

Edita `src/app/app.routes.ts`:

```typescript
import { SiiConfigComponent } from './components/sii-config/sii-config.component';

export const routes: Routes = [
  // ... otras rutas existentes
  {
    path: 'sii-config',
    component: SiiConfigComponent
  }
];
```

### 4️⃣ Agregar Enlace en el Menú (Opcional)

Si tienes un menú lateral o página de settings, agrega un enlace:

```html
<ion-item routerLink="/sii-config">
  <ion-icon name="cloud-upload-outline" slot="start"></ion-icon>
  <ion-label>Configuración SII</ion-label>
</ion-item>
```

### 5️⃣ Usar la Integración

1. **Inicia tu app Ionic:**
   ```bash
   npm start
   ```

2. **Navega a `/sii-config`** en tu app

3. **Configura tu certificado:**
   - Ingresa tu RUT
   - Ingresa la contraseña del certificado
   - Selecciona el ambiente (Certificación para pruebas)
   - Sube tu archivo `.pfx`
   - Haz clic en "Configurar Certificado"

4. **Consulta facturas:**
   - Selecciona rango de fechas
   - Haz clic en "Consultar Facturas"

## 📋 ¿Qué archivo .pfx necesito?

El archivo `.pfx` (o `.p12`) es tu **certificado digital del SII**. Lo obtienes así:

1. Ve a www.sii.cl
2. Inicia sesión con tu clave tributaria
3. Navega a: **Factura Electrónica → Certificado Digital**
4. Descarga o solicita tu certificado
5. El archivo tendrá extensión `.pfx` o `.p12`
6. Recuerda la contraseña que usaste

## ⚠️ Ambientes

### Certificación (Recomendado para empezar)
- 🧪 Para pruebas y desarrollo
- 🌐 URL: `maullin.sii.cl`
- ✅ Los datos no son reales
- 💡 Usa este para aprender y probar

### Producción
- 🏭 Para operaciones reales
- 🌐 URL: `palena.sii.cl`
- ⚠️ Solo cuando estés listo
- 💰 Los datos son reales

## 🔧 Integrar con tu Página de Facturas Existente

Si quieres agregar un botón para sincronizar facturas del SII en tu página actual de facturas:

```typescript
// En tu invoices.page.ts
import { SiiBackendService } from '../../services/sii/sii-backend.service';

constructor(private siiBackend: SiiBackendService) {}

async sincronizarConSII() {
  const hoy = new Date();
  const hace30Dias = new Date();
  hace30Dias.setDate(hace30Dias.getDate() - 30);

  const params = {
    fechaDesde: this.formatearFecha(hace30Dias), // Formato: YYYYMMDD
    fechaHasta: this.formatearFecha(hoy)
  };

  this.siiBackend.consultarFacturas(params).subscribe({
    next: (response) => {
      // Aquí recibes las facturas del SII
      console.log('Facturas del SII:', response);
      // Guardarlas en tu base de datos local
      this.guardarFacturasEnDB(response);
    },
    error: (error) => console.error('Error:', error)
  });
}

formatearFecha(fecha: Date): string {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  return `${year}${month}${day}`; // YYYYMMDD
}
```

## 🎯 Comandos Útiles

```bash
# Backend
cd backend-sii
npm install          # Instalar dependencias
npm start           # Iniciar servidor
npm run dev         # Iniciar con recarga automática

# Frontend (desde la carpeta SAF)
npm start           # Iniciar app Ionic
npm run build       # Compilar para producción
```

## 🐛 Problemas Comunes

### "Cannot find module '@angular/common/http'"
**Solución:** Ya está incluido en Angular, solo asegúrate de tener `provideHttpClient()` en tu configuración.

### "CORS error"
**Solución:** Asegúrate de que el backend esté corriendo en el puerto 3000.

### "Certificado no configurado"
**Solución:** Primero debes subir y configurar tu archivo `.pfx` en la página de configuración.

### Backend no inicia
**Solución:** 
```bash
cd backend-sii
rm -rf node_modules
npm install
npm start
```

## 📞 ¿Necesitas Ayuda?

1. Lee el archivo `INTEGRACION_SII.md` para más detalles
2. Revisa los logs en la consola del backend
3. Revisa los logs del navegador (F12)
4. Contacta al soporte técnico del SII

## ✅ Checklist de Implementación

- [ ] Backend instalado y corriendo
- [ ] HttpClient configurado en Angular
- [ ] Ruta agregada a `app.routes.ts`
- [ ] Certificado .pfx obtenido del SII
- [ ] Certificado configurado en la app
- [ ] Prueba realizada en ambiente de Certificación
- [ ] Facturas consultadas exitosamente

---

**¡Listo!** Ahora puedes consultar facturas del SII desde tu aplicación SAF. 🎉
