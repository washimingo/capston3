# 📊 Diagrama de Arquitectura - Integración SII

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        APLICACIÓN SAF                            │
│                    (Angular + Ionic)                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Componente: sii-config.component.ts                    │    │
│  │  - Interfaz de usuario                                  │    │
│  │  - Formulario de configuración                          │    │
│  │  - Subida de certificado .pfx                           │    │
│  │  - Consulta de facturas                                 │    │
│  └────────────────────┬───────────────────────────────────┘    │
│                       │                                          │
│  ┌────────────────────▼───────────────────────────────────┐    │
│  │  Servicio: sii-backend.service.ts                       │    │
│  │  - Comunicación con backend                             │    │
│  │  - Manejo de respuestas                                 │    │
│  │  - Transformación de datos                              │    │
│  └────────────────────┬───────────────────────────────────┘    │
└───────────────────────┼──────────────────────────────────────────┘
                        │
                        │ HTTP/REST
                        │
┌───────────────────────▼──────────────────────────────────────────┐
│                   BACKEND NODE.JS                                │
│                   (Express Server)                               │
│                   Puerto: 3000                                   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Endpoints REST                                           │  │
│  │  • POST /api/sii/configurar                              │  │
│  │  • POST /api/sii/subir-certificado                       │  │
│  │  • GET  /api/sii/token                                   │  │
│  │  • POST /api/sii/facturas                                │  │
│  │  • POST /api/sii/estado-dte                              │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                            │
│  ┌──────────────────▼───────────────────────────────────────┐  │
│  │  Módulo de Seguridad                                      │  │
│  │  - Manejo de certificado .pfx (node-forge)               │  │
│  │  - Firma digital de documentos                           │  │
│  │  - Gestión de claves privadas                            │  │
│  └──────────────────┬───────────────────────────────────────┘  │
└─────────────────────┼────────────────────────────────────────────┘
                      │
                      │ SOAP/XML
                      │
┌─────────────────────▼────────────────────────────────────────────┐
│                     API DEL SII                                  │
│                  (Servicio Web SOAP)                             │
│                                                                  │
│  Ambiente Certificación: maullin.sii.cl                         │
│  Ambiente Producción: palena.sii.cl                             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Servicios Disponibles:                                   │  │
│  │  • CrSeed.jws - Obtener semilla                          │  │
│  │  • GetTokenFromSeed.jws - Obtener token                  │  │
│  │  • QueryEstDte.jws - Consultar estado DTEs              │  │
│  │  • getEstDte - Estado de DTE específico                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Autenticación

```
Usuario                Frontend              Backend              SII
  │                      │                      │                  │
  │──1. Sube .pfx──────>│                      │                  │
  │                      │──2. Envía cert───>│                  │
  │                      │                      │                  │
  │                      │                      │──3. GET Semilla─>│
  │                      │                      │<─4. Semilla──────│
  │                      │                      │                  │
  │                      │                      │──5. Firma────────│
  │                      │                      │   (con .pfx)     │
  │                      │                      │                  │
  │                      │                      │──6. POST Token──>│
  │                      │                      │   (semilla firm) │
  │                      │                      │<─7. Token────────│
  │                      │<─8. Confirmación──│                  │
  │<─9. Éxito───────────│                      │                  │
```

## 📥 Flujo de Consulta de Facturas

```
Usuario                Frontend              Backend              SII
  │                      │                      │                  │
  │─1. Consulta────────>│                      │                  │
  │   facturas           │                      │                  │
  │                      │─2. POST /facturas─>│                  │
  │                      │   (fechas)           │                  │
  │                      │                      │                  │
  │                      │                      │─3. Valida token─>│
  │                      │                      │   (si expiró,    │
  │                      │                      │    renueva)      │
  │                      │                      │                  │
  │                      │                      │─4. SOAP Request─>│
  │                      │                      │   QueryEstDte    │
  │                      │                      │<─5. XML Response─│
  │                      │                      │                  │
  │                      │                      │─6. Parse XML─────│
  │                      │<─7. JSON Response──│                  │
  │<─8. Muestra─────────│   (facturas)         │                  │
  │   facturas           │                      │                  │
```

## 🔐 Manejo del Certificado Digital

```
┌─────────────────────────────────────────────────────┐
│           ARCHIVO .PFX (PKCS#12)                    │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  Certificado X.509                            │ │
│  │  - Información del titular                    │ │
│  │  - Clave pública                              │ │
│  │  - Periodo de validez                         │ │
│  │  - Firma de la CA (Autoridad Certificadora)   │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  Clave Privada                                │ │
│  │  - Encriptada con contraseña                  │ │
│  │  - Usada para firmar digitalmente             │ │
│  │  - NUNCA debe exponerse                       │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  Cadena de Certificados                       │ │
│  │  - Certificados intermedios                   │ │
│  │  - Certificado raíz (opcional)                │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘

                     ↓ node-forge

┌─────────────────────────────────────────────────────┐
│         FIRMA DIGITAL DE LA SEMILLA                 │
│                                                     │
│  1. Extrae clave privada del .pfx                  │
│  2. Crea hash SHA-1 de la semilla                  │
│  3. Firma el hash con la clave privada             │
│  4. Construye XML firmado con:                     │
│     - Semilla original                             │
│     - Firma digital (SignatureValue)               │
│     - Certificado público (X509Certificate)        │
│     - Información de la clave (KeyInfo)            │
└─────────────────────────────────────────────────────┘
```

## 📦 Estructura de Datos

### Factura del SII (Entrada)
```xml
<Documento>
  <Folio>12345</Folio>
  <TipoDTE>33</TipoDTE>
  <RutEmisor>12345678-9</RutEmisor>
  <RutReceptor>98765432-1</RutReceptor>
  <FchEmis>2024-01-15</FchEmis>
  <MntTotal>119000</MntTotal>
  <MntNeto>100000</MntNeto>
  <MntIVA>19000</MntIVA>
  <Estado>ACD</Estado>
</Documento>
```

### Factura en la App (Salida)
```typescript
interface FacturaSII {
  folio: number;           // 12345
  tipoDTE: number;         // 33
  rutEmisor: string;       // "12345678-9"
  rutReceptor: string;     // "98765432-1"
  fechaEmision: string;    // "2024-01-15"
  montoTotal: number;      // 119000
  montoNeto: number;       // 100000
  iva: number;             // 19000
  estado: string;          // "aceptada"
  trackId?: string;        // ID de seguimiento
}
```

## 🔒 Consideraciones de Seguridad

### ✅ Buenas Prácticas Implementadas

1. **Certificado en Backend**
   - ❌ NO se expone en el frontend
   - ✅ Se mantiene en memoria del servidor
   - ✅ No se guarda en disco

2. **Contraseña del Certificado**
   - ❌ NO se almacena en código
   - ✅ Se pasa solo cuando es necesario
   - ✅ Se limpia de memoria después de usar

3. **Token del SII**
   - ✅ Se almacena temporalmente en el backend
   - ✅ Se renueva automáticamente al expirar
   - ✅ Validez: ~6 horas

4. **Comunicación**
   - ✅ HTTPS en producción (recomendado)
   - ✅ CORS configurado correctamente
   - ✅ Validación de datos en backend

### 🚨 Riesgos a Evitar

- ❌ **NUNCA** subir el archivo .pfx al repositorio
- ❌ **NUNCA** hardcodear la contraseña
- ❌ **NUNCA** exponer el certificado en el frontend
- ❌ **NUNCA** usar HTTP en producción
- ❌ **NUNCA** compartir el certificado

## 🎯 Estados de las Facturas (SII)

| Código | Descripción | Estado en App |
|--------|-------------|---------------|
| ACD    | Aceptado    | aceptada      |
| RCD    | Rechazado   | rechazada     |
| RSC    | Reparo      | pendiente     |
| RFR    | Rechazo     | rechazada     |

## 📊 Tipos de DTE Soportados

| Código | Nombre                        | Uso Común           |
|--------|-------------------------------|---------------------|
| 33     | Factura Electrónica           | Ventas con IVA      |
| 34     | Factura Exenta Electrónica    | Ventas sin IVA      |
| 39     | Boleta Electrónica            | Consumidor final    |
| 52     | Guía de Despacho              | Traslado de bienes  |
| 56     | Nota de Débito                | Cargos adicionales  |
| 61     | Nota de Crédito               | Devoluciones        |

## 🔄 Ciclo de Vida del Token

```
Inicio
  │
  ▼
┌─────────────────┐
│ Token = null    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Obtener Semilla │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Firmar Semilla  │
│ (con .pfx)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Obtener Token   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Token Válido    │
│ (6 horas)       │
└────────┬────────┘
         │
         │ Uso normal
         │
    ┌────▼─────┐
    │ ¿Expiró? │
    └─┬──────┬─┘
      │      │
     No     Sí
      │      │
      │      └──> Renovar Token
      │
      ▼
   Continuar
```

## 💡 Optimizaciones Futuras

1. **Cache de Facturas**
   - Guardar facturas consultadas en DB local
   - Sincronización periódica automática
   - Evitar consultas repetidas

2. **Notificaciones**
   - Alertar cuando llegan nuevas facturas
   - Recordatorios de facturas por vencer
   - Push notifications

3. **Procesamiento en Lote**
   - Consultar múltiples periodos
   - Procesar facturas en background
   - Queue de peticiones

4. **Análisis y Reportes**
   - Dashboard de facturación
   - Gráficos de tendencias
   - Exportación de datos

---

Este documento proporciona una visión completa de la arquitectura de la integración con el SII.
