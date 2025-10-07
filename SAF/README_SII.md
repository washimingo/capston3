# 🔐 Integración SII - Proyecto SAF

## 📌 Resumen

Esta integración te permite **consumir la API del SII de Chile** para obtener automáticamente las facturas emitidas por tu empresa y mostrarlas en la aplicación SAF.

## 🎯 ¿Qué hace esta integración?

✅ Autentica tu aplicación con el SII usando un certificado digital (.pfx)  
✅ Consulta facturas electrónicas emitidas  
✅ Verifica el estado de los DTEs (Documentos Tributarios Electrónicos)  
✅ Muestra las facturas en tu aplicación  
✅ Protege tu certificado digital de forma segura en el backend  

## 🔑 ¿Qué es el archivo .pfx?

El archivo `.pfx` (también `.p12`) es tu **certificado digital** que contiene:

- 🔐 Tu **identidad digital** ante el SII
- 🔑 Una **clave privada** para firmar peticiones
- 🛡️ Está **protegido con contraseña**

### ¿Dónde lo obtengo?

1. Entra a [www.sii.cl](https://www.sii.cl)
2. Inicia sesión con tu RUT y clave
3. Ve a: **Factura Electrónica** → **Certificado Digital**
4. Descarga o solicita tu certificado
5. Guárdalo en un lugar seguro

## 🚀 Inicio Rápido

### Opción A: Script Automático (Recomendado)

```bash
cd /workspaces/capston3/SAF
./iniciar-sii.sh
```

Este script:
- ✅ Verifica dependencias
- ✅ Instala paquetes necesarios
- ✅ Inicia el servidor backend
- ✅ Te muestra los siguientes pasos

### Opción B: Manual

#### 1️⃣ Iniciar el Backend

```bash
cd backend-sii
npm install
npm start
```

✅ El backend estará en `http://localhost:3000`

#### 2️⃣ Iniciar la App

```bash
# En otra terminal
cd /workspaces/capston3/SAF
npm start
```

✅ La app estará en `http://localhost:8100`

#### 3️⃣ Configurar

1. Navega a `http://localhost:8100/sii-config`
2. Completa el formulario:
   - **RUT**: Tu RUT empresarial
   - **Contraseña**: Contraseña del certificado
   - **Ambiente**: Certificación (para pruebas) o Producción
   - **Certificado**: Sube tu archivo .pfx
3. Haz clic en **"Configurar Certificado"**
4. Consulta tus facturas con el botón **"Consultar Facturas"**

## 📚 Documentación Completa

| Documento | Descripción |
|-----------|-------------|
| **[INICIO_RAPIDO_SII.md](INICIO_RAPIDO_SII.md)** | Guía paso a paso en 5 minutos |
| **[INTEGRACION_SII.md](INTEGRACION_SII.md)** | Documentación técnica completa |
| **[ARQUITECTURA_SII.md](ARQUITECTURA_SII.md)** | Diagramas y flujos del sistema |

## 🏗️ Arquitectura

```
┌─────────────────┐
│  Angular/Ionic  │  ← Frontend (Puerto 8100)
│   (Frontend)    │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│   Node.js/      │  ← Backend (Puerto 3000)
│   Express       │     • Maneja certificado .pfx
│   (Backend)     │     • Firma peticiones
└────────┬────────┘     • Consulta SII
         │ SOAP
         ▼
┌─────────────────┐
│   API del SII   │  ← Servicio oficial del SII
│   (Chile)       │
└─────────────────┘
```

## 🔒 Seguridad

⚠️ **IMPORTANTE**: Esta integración implementa las mejores prácticas de seguridad:

- ✅ El certificado .pfx **solo se maneja en el backend**
- ✅ La contraseña **no se guarda** permanentemente
- ✅ El token del SII se **almacena temporalmente**
- ✅ La firma digital se hace **servidor-side**
- ❌ **NUNCA** subas tu .pfx al repositorio Git

## 🌐 Ambientes

### 🧪 Certificación (Recomendado para empezar)
- **URL**: `maullin.sii.cl`
- **Propósito**: Pruebas y desarrollo
- **Datos**: No son reales
- 💡 **Usa este ambiente para aprender**

### 🏭 Producción
- **URL**: `palena.sii.cl`
- **Propósito**: Operaciones reales
- **Datos**: Son reales
- ⚠️ **Solo cuando estés listo**

## 📁 Archivos Creados

```
SAF/
├── backend-sii/                     # Backend Node.js
│   ├── server.js                    # Servidor principal
│   ├── package.json                 # Dependencias
│   ├── .env.example                 # Ejemplo de configuración
│   ├── .gitignore                   # Protección de archivos
│   └── uploads/                     # Archivos temporales
│
├── src/app/
│   ├── services/sii/
│   │   ├── sii.service.ts           # Servicio principal SII
│   │   └── sii-backend.service.ts   # Comunicación con backend
│   │
│   └── components/sii-config/
│       ├── sii-config.component.ts   # Lógica del componente
│       ├── sii-config.component.html # Interfaz de usuario
│       └── sii-config.component.scss # Estilos
│
├── INICIO_RAPIDO_SII.md             # Guía rápida
├── INTEGRACION_SII.md               # Documentación completa
├── ARQUITECTURA_SII.md              # Arquitectura del sistema
├── iniciar-sii.sh                   # Script de inicio automático
└── README_SII.md                    # Este archivo
```

## 🐛 Solución de Problemas

### Backend no inicia

```bash
cd backend-sii
rm -rf node_modules
npm install
npm start
```

### Error "Cannot find module"

```bash
# En la carpeta SAF
npm install
```

### Error CORS

Verifica que el backend esté corriendo en el puerto 3000.

### Certificado no configurado

Asegúrate de haber subido el archivo .pfx correctamente en `/sii-config`.

## 📞 Soporte

Si tienes problemas:

1. 📖 Revisa la documentación en los archivos .md
2. 🔍 Verifica los logs en la consola del navegador (F12)
3. 📋 Revisa los logs del backend en la terminal
4. 📚 Consulta la [documentación oficial del SII](https://www.sii.cl)

## ✅ Checklist de Implementación

- [x] Backend creado
- [x] Servicios Angular creados
- [x] Componente de UI creado
- [x] Rutas configuradas
- [x] HttpClient configurado
- [ ] Backend iniciado (`npm start` en backend-sii)
- [ ] Certificado .pfx obtenido del SII
- [ ] Certificado configurado en la app
- [ ] Facturas consultadas exitosamente

## 🎉 ¡Listo!

Ahora puedes:

1. **Iniciar el backend**: `./iniciar-sii.sh` o manualmente
2. **Abrir la app**: http://localhost:8100
3. **Configurar**: Ve a `/sii-config`
4. **Consultar**: Obtén tus facturas del SII

---

**Nota**: Esta integración está diseñada específicamente para el SII de Chile. Requiere un certificado digital válido emitido por el SII.

¿Necesitas ayuda? Lee los archivos de documentación o revisa los comentarios en el código. 🚀
