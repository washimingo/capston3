# 📊 SAF - Sistema de Alertas de Facturas

Sistema de gestión y seguimiento de facturas electrónicas con alertas automáticas escalonadas.

[![Angular](https://img.shields.io/badge/Angular-20.3.4-red.svg)](https://angular.io/)
[![Ionic](https://img.shields.io/badge/Ionic-8.7.6-blue.svg)](https://ionicframework.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-95_passing-success.svg)](./TESTING-README.md)
[![Coverage](https://img.shields.io/badge/Coverage-85%25-brightgreen.svg)](./TESTING-README.md)

---

## 🚀 Características Principales

- ✅ **Sistema de Alertas Automáticas**: Notificaciones escalonadas en días 0, 3, 6, 7 y 8
- ✅ **Gestión Completa de Facturas**: CRUD con bitácora de auditoría
- ✅ **Dashboard Analítico**: Gráficos y métricas en tiempo real
- ✅ **Reportes Exportables**: PDF, Excel y CSV
- ✅ **Autenticación Segura**: Firebase Authentication
- ✅ **Multiplataforma**: Web, Android e iOS
- ✅ **Modo Offline**: IndexedDB para almacenamiento local
- ✅ **Testing Completo**: 95 pruebas unitarias con TDD

---

## 📋 Tabla de Contenidos

- [Instalación](#-instalación)
- [Uso](#-uso)
- [Arquitectura](#-arquitectura)
- [Testing](#-testing)
- [Documentación](#-documentación)
- [Despliegue](#-despliegue)
- [Contribución](#-contribución)

---

## 💻 Instalación

### Requisitos Previos

```bash
Node.js >= 18.x
npm >= 9.x
Angular CLI >= 20.x
Ionic CLI >= 7.x
```

### Pasos de Instalación

```bash
# Clonar el repositorio
git clone https://github.com/washimingo/capston3.git
cd SAF

# Instalar dependencias
npm install

# Configurar Firebase
# Crear archivo src/environments/environment.ts con tus credenciales

# Ejecutar en desarrollo
npm start
# o
ionic serve
```

El proyecto estará disponible en `http://localhost:4200`

---

## 🎯 Uso

### Autenticación

1. Acceder a la aplicación
2. Ingresar email y contraseña
3. El sistema redirige al dashboard

### Gestión de Facturas

#### Agregar Factura
- Navegar a **Invoices**
- Click en botón "+"
- Completar formulario
- Guardar

#### Importar Facturas
- Navegar a **Invoices**
- Click en "Importar CSV/Excel"
- Seleccionar archivo
- Confirmar importación

#### Filtrar Facturas
- Usar barra de búsqueda
- Aplicar filtros por estado
- Filtrar por rango de fechas
- Filtrar por monto

### Sistema de Alertas

Las alertas se generan automáticamente:

```
Día 0  → Notificación al responsable
Día 3  → Recordatorio al responsable
Día 6  → Recordatorio al responsable
Día 7  → Escalamiento a Jefatura
Día 8  → Escalamiento a Dirección (CRÍTICO)
```

### Dashboard

El dashboard muestra:
- Resumen de facturas totales
- Facturas por vencer hoy
- Monto total en circulación
- Gráficos de distribución
- Top proveedores

### Reportes

#### Generar Reporte PDF
1. Navegar a **Reports**
2. Aplicar filtros deseados
3. Click en "Exportar PDF"
4. El archivo se descarga automáticamente

#### Generar Reporte Excel
1. Navegar a **Reports**
2. Aplicar filtros deseados
3. Click en "Exportar Excel"
4. El archivo se descarga automáticamente

---

## 🏗️ Arquitectura

### Estructura del Proyecto

```
SAF/
├── src/
│   ├── app/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── services/       # Lógica de negocio
│   │   ├── guards/         # Protección de rutas
│   │   ├── models/         # Interfaces y tipos
│   │   ├── pipes/          # Transformaciones
│   │   └── interfaces/     # Interfaces adicionales
│   ├── assets/             # Recursos estáticos
│   └── environments/       # Configuraciones
└── www/                    # Build de producción
```

### Stack Tecnológico

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| Framework | Angular | 20.3.4 |
| UI | Ionic | 8.7.6 |
| Lenguaje | TypeScript | 5.9.3 |
| Base de Datos | IndexedDB | - |
| Autenticación | Firebase | 12.4.0 |
| Gráficos | Chart.js | 4.5.0 |
| PDF | jsPDF | 3.0.3 |
| Excel | XLSX | 0.18.5 |
| Estilos | Tailwind CSS | 4.1.14 |
| Testing | Jasmine + Karma | 5.12.0 / 6.4.4 |

### Servicios Principales

#### 1. Alertas Service
Gestiona el sistema de notificaciones automáticas.

```typescript
// Generar alertas para facturas
alertasService.generarAlertasPorFacturas(facturas);

// Obtener alertas pendientes
const alertas = alertasService.getAlertasPendientes(usuarioId);
```

#### 2. Database Service
Maneja IndexedDB para almacenamiento local.

```typescript
// Agregar factura
const id = await dbService.addFactura(factura);

// Obtener todas las facturas
const facturas = await dbService.getFacturas();

// Cambiar estado
await dbService.cambiarEstadoFactura(id, 'aprobada', 'usuario', 'comentario');
```

#### 3. Firebase Service
Gestiona autenticación con Firebase.

```typescript
// Login
await firebaseService.login(email, password);

// Logout
await firebaseService.logout();

// Verificar autenticación
const isAuth = firebaseService.isAuthenticated();
```

---

## 🧪 Testing

### Ejecutar Pruebas

```bash
# Todas las pruebas
npm test

# Con cobertura
npm run test -- --code-coverage

# Modo headless (CI/CD)
npm run test -- --browsers=ChromeHeadless --watch=false
```

### Cobertura de Pruebas

| Componente | Tests | Estado |
|-----------|-------|--------|
| Alertas Service | 15 | ✅ |
| Database Service | 13 | ✅ |
| Firebase Service | 11 | ✅ |
| Auth Guard | 4 | ✅ |
| PorVencer Pipe | 14 | ✅ |
| PDF Component | 18 | ✅ |
| Header Component | 20 | ✅ |
| **TOTAL** | **95** | ✅ |

**Cobertura Global**: 85%

### Metodología TDD

Este proyecto sigue Test-Driven Development:

1. **Red**: Escribir test que falla
2. **Green**: Implementar código mínimo
3. **Refactor**: Mejorar código manteniendo tests

Para más detalles, ver [TESTING-README.md](./TESTING-README.md)

---

## 📚 Documentación

### Documentos Disponibles

| Documento | Descripción |
|-----------|-------------|
| [TESTING-README.md](./TESTING-README.md) | Documentación completa de pruebas unitarias |
| [TESTING-GUIDE.md](./TESTING-GUIDE.md) | Guía rápida y comandos útiles |
| [PROJECT-ANALYSIS.md](./PROJECT-ANALYSIS.md) | Análisis técnico completo del proyecto |

### Componentes Documentados

- **Alertas Service**: Sistema de notificaciones
- **Database Service**: Gestión de IndexedDB
- **Firebase Service**: Autenticación
- **Auth Guard**: Protección de rutas
- **PorVencer Pipe**: Filtro de facturas
- **PDF Component**: Visualizador de PDFs
- **Header Component**: Encabezado reutilizable

---

## 🚀 Despliegue

### Build de Producción

```bash
# Web
npm run build
# Los archivos estarán en www/

# Android
ionic capacitor build android

# iOS
ionic capacitor build ios
```

### Variables de Entorno

Crear `src/environments/environment.ts`:

```typescript
export const environment = {
  production: true,
  firebase: {
    apiKey: 'TU_API_KEY',
    authDomain: 'TU_AUTH_DOMAIN',
    projectId: 'TU_PROJECT_ID',
    storageBucket: 'TU_STORAGE_BUCKET',
    messagingSenderId: 'TU_MESSAGING_SENDER_ID',
    appId: 'TU_APP_ID'
  }
};
```

### Optimizaciones

El build de producción incluye:
- ✅ Tree shaking
- ✅ Minificación
- ✅ Compresión
- ✅ Lazy loading
- ✅ AOT compilation

---

## 🤝 Contribución

### Proceso de Contribución

1. Fork del proyecto
2. Crear rama feature
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Escribir tests primero (TDD)
4. Implementar funcionalidad
5. Asegurar que todos los tests pasen
   ```bash
   npm test
   ```
6. Commit con mensaje descriptivo
   ```bash
   git commit -m "feat: agregar nueva funcionalidad"
   ```
7. Push a la rama
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
8. Crear Pull Request

### Estándares de Código

- ✅ Seguir guía de estilo de Angular
- ✅ Cobertura de tests > 80%
- ✅ Sin errores de linting
- ✅ Comentarios en código complejo
- ✅ Nombres descriptivos en español

### Commits Convencionales

```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
test: agregar o modificar tests
refactor: refactorización de código
style: cambios de formato
chore: tareas de mantenimiento
```

---

## 📊 Métricas del Proyecto

### Líneas de Código

```
TypeScript: ~4,500 líneas
HTML: ~2,000 líneas
SCSS: ~1,000 líneas
Tests: ~2,500 líneas
```

### Componentes

```
Páginas: 7
Componentes: 4
Servicios: 3
Guards: 1
Pipes: 1
```

### Dependencias

```
Producción: 24 dependencias
Desarrollo: 18 dependencias
Total: 42 dependencias
```

---

## 🐛 Problemas Conocidos

- [ ] Performance en listas con > 1000 facturas (implementar virtual scroll)
- [ ] Sincronización con Firebase en segundo plano
- [ ] Notificaciones push en móviles

---

## 🗺️ Roadmap

### v1.0.0 (Actual)
- ✅ CRUD de facturas
- ✅ Sistema de alertas
- ✅ Dashboard con gráficos
- ✅ Exportación a PDF/Excel
- ✅ Autenticación Firebase

### v1.1.0 (Próximo)
- [ ] Notificaciones push
- [ ] Sincronización automática
- [ ] Modo offline completo
- [ ] Temas light/dark
- [ ] Multi-idioma

### v2.0.0 (Futuro)
- [ ] Integración con SII
- [ ] Machine Learning para predicciones
- [ ] Dashboard personalizable
- [ ] API REST pública
- [ ] App nativa

---

## 📞 Soporte

### Contacto

- **Email**: soporte@saf.com
- **Issues**: [GitHub Issues](https://github.com/washimingo/capston3/issues)

### FAQ

**¿Cómo resetear la base de datos?**
```javascript
// En DevTools Console
indexedDB.deleteDatabase('saf_db');
```

**¿Cómo agregar un nuevo usuario?**
- Usar Firebase Console para crear usuarios

**¿Cómo generar logs de debug?**
```typescript
// Activar modo debug en environment.ts
debug: true
```

---

## 📄 Licencia

Este proyecto es privado y confidencial. Todos los derechos reservados.

---

## 👥 Equipo

- **Desarrollo**: Equipo SAF
- **Testing**: Equipo QA
- **Diseño**: Equipo UX/UI

---

## 🙏 Agradecimientos

- Angular Team
- Ionic Team
- Firebase Team
- Comunidad Open Source

---

## 📝 Changelog

### [0.0.1] - 2025-10-23

#### Added
- Sistema completo de gestión de facturas
- Sistema de alertas automáticas
- Dashboard con gráficos interactivos
- Exportación a PDF y Excel
- Autenticación con Firebase
- 95 pruebas unitarias
- Documentación completa

---

**Versión**: 0.0.1  
**Última actualización**: 23 de Octubre, 2025  
**Estado**: En Desarrollo Activo 🚀

---

## 🔗 Enlaces Rápidos

- [Documentación de Testing](./TESTING-README.md)
- [Guía de Testing](./TESTING-GUIDE.md)
- [Análisis del Proyecto](./PROJECT-ANALYSIS.md)
- [Angular Docs](https://angular.io/)
- [Ionic Docs](https://ionicframework.com/)
