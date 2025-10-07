# Integración con API del SII de Chile

Este documento explica cómo integrar tu aplicación SAF con la API del Servicio de Impuestos Internos (SII) de Chile para consultar facturas emitidas.

## 📋 Requisitos Previos

1. **Certificado Digital (.pfx o .p12)** emitido por el SII
2. **RUT de la empresa**
3. **Contraseña del certificado**
4. **Node.js** instalado (versión 14 o superior)

## 🔑 Sobre el Certificado Digital (.pfx)

El archivo `.pfx` (también conocido como `.p12`) es un certificado digital que:

- Es emitido por el SII de Chile
- Contiene tu clave privada y certificado público
- Se usa para firmar digitalmente las peticiones al SII
- Requiere una contraseña para su uso

### ¿Cómo obtener el certificado?

1. Ingresa al sitio del SII (www.sii.cl)
2. Ve a "Factura Electrónica" → "Certificado Digital"
3. Solicita o descarga tu certificado
4. Guarda el archivo `.pfx` en un lugar seguro

## 🚀 Configuración del Backend

### Paso 1: Instalar dependencias del backend

```bash
cd backend-sii
npm install
```

### Paso 2: Iniciar el servidor backend

```bash
npm start
```

El servidor se iniciará en `http://localhost:3000`

### Para desarrollo con recarga automática:

```bash
npm run dev
```

## 🔧 Configuración del Frontend (Angular/Ionic)

### Paso 1: Agregar HttpClient al app.config

Asegúrate de tener `HttpClient` configurado en tu aplicación:

```typescript
// app.config.ts o main.ts
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... otros providers
    provideHttpClient(),
  ]
};
```

### Paso 2: Agregar la ruta al componente de configuración

```typescript
// app.routes.ts
import { SiiConfigComponent } from './components/sii-config/sii-config.component';

export const routes: Routes = [
  // ... otras rutas
  {
    path: 'sii-config',
    component: SiiConfigComponent
  }
];
```

## 📱 Uso de la Integración

### 1. Configurar el Certificado

1. Navega a la página de configuración SII en tu app
2. Ingresa el RUT de tu empresa (ej: 12.345.678-9)
3. Ingresa la contraseña del certificado
4. Selecciona el ambiente:
   - **Certificación**: Para pruebas (usa maullin.sii.cl)
   - **Producción**: Para operaciones reales (usa palena.sii.cl)
5. Selecciona tu archivo `.pfx`
6. Haz clic en "Configurar Certificado"

### 2. Consultar Facturas

Una vez configurado el certificado:

1. Selecciona el rango de fechas (Desde - Hasta)
2. Haz clic en "Consultar Facturas"
3. Las facturas se mostrarán en la lista

## 🔐 Seguridad

⚠️ **IMPORTANTE**: 

- **NUNCA** expongas el certificado `.pfx` ni la contraseña en el código frontend
- El backend maneja toda la lógica de firma y autenticación
- El certificado se mantiene en memoria en el backend (no se guarda en disco)
- En producción, considera usar variables de entorno y almacenamiento seguro

### Mejores prácticas de seguridad:

```javascript
// ❌ MALO - No hagas esto
const password = "mipassword123"; // Hardcoded

// ✅ BUENO - Usa variables de entorno
const password = process.env.CERT_PASSWORD;
```

## 📡 Servicios Disponibles del SII

### 1. Obtener Token
- Autentica tu aplicación con el SII
- El token es válido por aproximadamente 6 horas

### 2. Consultar Facturas Emitidas
- Rango de fechas
- Filtro por estado
- Devuelve lista de DTEs

### 3. Consultar Estado de DTE
- Verifica el estado de un documento específico
- Requiere: Tipo DTE, Folio, RUT Emisor, RUT Receptor, Fecha, Monto

## 🌐 Ambientes del SII

### Certificación (Pruebas)
- URL: `https://maullin.sii.cl/DTEWS`
- Usa este ambiente para desarrollo y pruebas
- Los datos no son reales

### Producción
- URL: `https://palena.sii.cl/DTEWS`
- Solo para operaciones reales
- Usa certificados válidos de producción

## 📝 Tipos de DTE (Documentos Tributarios Electrónicos)

- **33**: Factura Electrónica
- **34**: Factura Exenta Electrónica
- **39**: Boleta Electrónica
- **41**: Boleta Exenta Electrónica
- **43**: Liquidación Factura Electrónica
- **46**: Factura de Compra Electrónica
- **52**: Guía de Despacho Electrónica
- **56**: Nota de Débito Electrónica
- **61**: Nota de Crédito Electrónica

## 🐛 Solución de Problemas

### Error: "Certificado no configurado"
- Verifica que hayas subido el archivo `.pfx` correctamente
- Asegúrate de que el backend esté corriendo

### Error: "No se pudo obtener la semilla"
- Verifica tu conexión a internet
- Confirma que el ambiente seleccionado sea correcto
- Revisa que las URLs del SII estén accesibles

### Error: "Token inválido"
- El token puede haber expirado (duración: ~6 horas)
- Intenta reconfigurar el certificado

### Error: "Error firmando semilla"
- Verifica que la contraseña del certificado sea correcta
- Asegúrate de que el archivo `.pfx` no esté corrupto

## 📚 Recursos Adicionales

- [Documentación oficial del SII](https://www.sii.cl/)
- [Portal de Factura Electrónica](https://palena.sii.cl/)
- [Ambiente de Certificación](https://maullin.sii.cl/)

## 🔄 Flujo de Autenticación

```
1. Cliente solicita consultar facturas
   ↓
2. Backend obtiene semilla del SII
   ↓
3. Backend firma la semilla con el certificado .pfx
   ↓
4. Backend envía semilla firmada al SII
   ↓
5. SII valida y devuelve un token
   ↓
6. Backend usa el token para consultar facturas
   ↓
7. SII devuelve las facturas en formato XML
   ↓
8. Backend parsea XML y devuelve JSON al cliente
```

## 📦 Estructura de Archivos

```
SAF/
├── src/
│   └── app/
│       ├── services/
│       │   └── sii/
│       │       ├── sii.service.ts              # Servicio principal SII
│       │       └── sii-backend.service.ts      # Servicio para backend
│       └── components/
│           └── sii-config/
│               ├── sii-config.component.ts      # Componente UI
│               ├── sii-config.component.html    # Template
│               └── sii-config.component.scss    # Estilos
└── backend-sii/
    ├── server.js              # Servidor Node.js/Express
    ├── package.json           # Dependencias
    └── uploads/               # Carpeta temporal (se crea automáticamente)
```

## 🚦 Próximos Pasos

1. [ ] Guardar facturas consultadas en la base de datos local
2. [ ] Implementar sincronización automática periódica
3. [ ] Agregar notificaciones cuando lleguen nuevas facturas
4. [ ] Implementar caché de token para reducir llamadas al SII
5. [ ] Agregar logs de auditoría
6. [ ] Implementar reintentos automáticos en caso de error

## 📞 Soporte

Si tienes problemas con la integración:

1. Revisa los logs del backend en la consola
2. Verifica los logs del navegador (F12 → Console)
3. Consulta la documentación oficial del SII
4. Contacta al soporte técnico del SII si es necesario

---

**Nota**: Esta integración está diseñada para el SII de Chile. Si estás en otro país, necesitarás adaptar el código a tu autoridad tributaria local.
