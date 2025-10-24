# Documentación de Pruebas Unitarias - SAF (Sistema de Alertas de Facturas)

## Índice
1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Metodología TDD](#metodología-tdd)
3. [Configuración de Pruebas](#configuración-de-pruebas)
4. [Cobertura de Pruebas](#cobertura-de-pruebas)
5. [Pruebas por Componente](#pruebas-por-componente)
6. [Ejecución de Pruebas](#ejecución-de-pruebas)
7. [Mejores Prácticas](#mejores-prácticas)

---

## Descripción del Proyecto

**SAF (Sistema de Alertas de Facturas)** es una aplicación desarrollada con Angular 20 e Ionic 8 que gestiona facturas electrónicas con un sistema de alertas automatizado. El proyecto utiliza:

- **Frontend**: Angular 20.3.4 + Ionic 8.7.6
- **Base de Datos Local**: IndexedDB
- **Autenticación**: Firebase Authentication
- **Visualización**: Chart.js para gráficos
- **Exportación**: jsPDF y XLSX
- **Testing**: Jasmine + Karma

### Funcionalidades Principales

1. **Gestión de Facturas**: CRUD completo de facturas con bitácora de cambios
2. **Sistema de Alertas**: Notificaciones automáticas en días 0, 3, 6, 7 y 8
3. **Dashboard**: Visualización de métricas y gráficos estadísticos
4. **Reportes**: Generación de reportes en PDF y Excel
5. **Autenticación**: Login seguro con Firebase
6. **Filtros Avanzados**: Búsqueda y filtrado de facturas por múltiples criterios

---

## Metodología TDD

Este proyecto sigue la metodología **Test-Driven Development (TDD)**, que consiste en:

1. **Red**: Escribir una prueba que falle
2. **Green**: Escribir el código mínimo para que la prueba pase
3. **Refactor**: Mejorar el código manteniendo las pruebas en verde

### Ventajas de TDD en este proyecto:

- ✅ Código más mantenible y robusto
- ✅ Documentación viva del comportamiento esperado
- ✅ Detección temprana de errores
- ✅ Facilita el refactoring
- ✅ Mejor diseño de software

---

## Configuración de Pruebas

### Archivos de Configuración

#### karma.conf.js
```javascript
frameworks: ['jasmine', '@angular-devkit/build-angular']
browsers: ['Chrome']
```

#### tsconfig.spec.json
Configuración específica para TypeScript en pruebas.

### Dependencias de Testing

```json
{
  "jasmine-core": "5.12.0",
  "jasmine-spec-reporter": "7.0.0",
  "karma": "~6.4.4",
  "karma-chrome-launcher": "~3.2.0",
  "karma-coverage": "~2.2.1",
  "karma-jasmine": "~5.1.0",
  "karma-jasmine-html-reporter": "~2.1.0"
}
```

---

## Cobertura de Pruebas

### Resumen de Componentes Testeados

| Componente/Servicio | Archivo de Prueba | # de Tests | Estado |
|---------------------|-------------------|------------|--------|
| Alertas Service | `alertas.spec.ts` | 15 | ✅ Completo |
| Database Service | `db.spec.ts` | 13 | ✅ Completo |
| Firebase Service | `firedb.spec.ts` | 11 | ✅ Completo |
| Auth Guard | `auth.guard.spec.ts` | 4 | ✅ Completo |
| PorVencer Pipe | `por-vencer-pipe.spec.ts` | 14 | ✅ Completo |
| PDF Component | `pdf.component.spec.ts` | 18 | ✅ Completo |
| Header Component | `header.component.spec.ts` | 20 | ✅ Completo |

**Total de Pruebas Unitarias: 95**

---

## Pruebas por Componente

### 1. Alertas Service (`alertas.spec.ts`)

**Propósito**: Gestiona el sistema de alertas automáticas para facturas pendientes.

#### Funcionalidades Testeadas:

##### `generarAlertasPorFacturas()`
- ✅ Genera alerta D0 para facturas recibidas hoy
- ✅ Genera alerta D3 para facturas con 3 días de antigüedad
- ✅ Incluye jefatura en alertas D7
- ✅ Incluye dirección en alertas D8
- ✅ No genera alertas para facturas no pendientes
- ✅ Evita duplicación de alertas

**Ejemplo de Prueba:**
```typescript
it('debería generar alerta D0 para factura pendiente recibida hoy', () => {
  const hoy = new Date();
  const facturas: Factura[] = [{
    id: 1,
    folio: 'F001',
    fechaRecepcion: hoy.toISOString(),
    estado: 'pendiente',
    responsable: 'usuario@example.com'
  }];

  service.generarAlertasPorFacturas(facturas);
  const alertas = service.getAlertasPendientes('usuario@example.com');

  expect(alertas[0].tipo).toBe('D0');
});
```

##### `programarAlertasParaFactura()`
- ✅ Programa 5 alertas (D0, D3, D6, D7, D8)
- ✅ Calcula fechas programadas correctamente

##### `marcarAlertaComoEnviada()`
- ✅ Cambia el estado de pendiente a enviada

##### `getAlertasPendientes()`
- ✅ Filtra alertas por usuario
- ✅ Retorna array vacío si no hay alertas

**Casos de Uso:**
1. Sistema envía alerta automática día 0
2. Escalamiento a jefatura en día 7
3. Escalamiento a dirección en día 8

---

### 2. Database Service (`db.spec.ts`)

**Propósito**: Gestiona la base de datos local IndexedDB para almacenar facturas y bitácora.

#### Funcionalidades Testeadas:

##### `addFactura()`
- ✅ Agrega facturas correctamente
- ✅ Agrega facturas con bitácora
- ✅ Retorna ID generado

##### `getFacturas()`
- ✅ Retorna todas las facturas
- ✅ Retorna array vacío si no hay datos

##### `updateFactura()`
- ✅ Actualiza facturas existentes
- ✅ Mantiene otros campos intactos

##### `deleteFactura()`
- ✅ Elimina facturas por ID

##### `cambiarEstadoFactura()`
- ✅ Cambia estado y registra en bitácora
- ✅ Incluye comentarios opcionales

**Ejemplo de Prueba:**
```typescript
it('debería cambiar el estado y registrar en bitácora', async () => {
  const factura = { folio: 'F005', estado: 'pendiente' };
  const id = await service.addFactura(factura);
  
  await service.cambiarEstadoFactura(
    id as number,
    'aprobada',
    'admin@example.com',
    'Aprobación manual'
  );

  const bitacora = await service.getBitacoraByFactura(id as number);
  expect(bitacora[0].accion).toContain('aprobada');
});
```

##### `getBitacoraByFactura()`
- ✅ Retorna historial de cambios
- ✅ Filtra por ID de factura

**Casos de Uso:**
1. Almacenamiento local de facturas sin conexión
2. Auditoría completa de cambios
3. Sincronización con Firebase

---

### 3. Firebase Service (`firedb.spec.ts`)

**Propósito**: Gestiona la autenticación de usuarios con Firebase.

#### Funcionalidades Testeadas:

##### `login()`
- ✅ Inicia sesión con credenciales válidas
- ✅ Rechaza credenciales inválidas
- ✅ Maneja errores específicos:
  - `auth/invalid-email`
  - `auth/user-not-found`
  - `auth/wrong-password`
  - `auth/too-many-requests`
  - `auth/network-request-failed`

**Ejemplo de Prueba:**
```typescript
it('debería manejar error de email inválido', async () => {
  try {
    await service.login('invalid-email', 'password');
    fail('Debería haber lanzado un error');
  } catch (error: any) {
    expect(error.message).toBe('El correo electrónico no es válido');
  }
});
```

##### `logout()`
- ✅ Cierra sesión correctamente
- ✅ Limpia usuario actual

##### `getCurrentUser()`
- ✅ Retorna usuario autenticado
- ✅ Retorna null si no hay sesión

##### `isAuthenticated()`
- ✅ Verifica estado de autenticación

##### `getAuthState()`
- ✅ Retorna Observable del estado

**Casos de Uso:**
1. Login de usuarios del departamento
2. Protección de rutas privadas
3. Gestión de sesiones

---

### 4. Auth Guard (`auth.guard.spec.ts`)

**Propósito**: Protege rutas que requieren autenticación.

#### Funcionalidades Testeadas:

##### `canActivate()`
- ✅ Permite acceso con usuario autenticado
- ✅ Deniega acceso y redirige sin autenticación
- ✅ Toma solo el primer valor del observable
- ✅ Funciona con múltiples verificaciones

**Ejemplo de Prueba:**
```typescript
it('debería denegar acceso y redirigir cuando no hay usuario', (done) => {
  firedbService.getAuthState.and.returnValue(of(null));

  TestBed.runInInjectionContext(() => {
    const result = authGuard({} as any, {} as any);

    if (result instanceof Observable) {
      result.subscribe((canActivate: boolean) => {
        expect(canActivate).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/authentication']);
        done();
      });
    }
  });
});
```

**Casos de Uso:**
1. Redirección automática a login
2. Protección del dashboard
3. Seguridad de páginas administrativas

---

### 5. PorVencer Pipe (`por-vencer-pipe.spec.ts`)

**Propósito**: Filtra facturas que están próximas a vencer (dentro de 7 días).

#### Funcionalidades Testeadas:

##### `transform()`
- ✅ Filtra por estado "Por vencer" (case-insensitive)
- ✅ Filtra por fecha de vencimiento en 7 días
- ✅ Incluye facturas que vencen hoy
- ✅ Excluye facturas vencidas
- ✅ Excluye facturas con más de 7 días
- ✅ Maneja fechas inválidas
- ✅ Combina múltiples criterios
- ✅ Preserva orden original

**Ejemplo de Prueba:**
```typescript
it('debería filtrar facturas con fecha de vencimiento en los próximos 7 días', () => {
  const hoy = new Date();
  const en3Dias = new Date(hoy);
  en3Dias.setDate(en3Dias.getDate() + 3);
  
  const facturas = [
    { id: 1, fechaVencimiento: en3Dias.toISOString(), monto: 1000 }
  ];

  const resultado = pipe.transform(facturas);
  expect(resultado.length).toBe(1);
});
```

**Casos de Uso:**
1. Vista rápida de facturas urgentes
2. Dashboard de alertas
3. Priorización de trabajo

---

### 6. PDF Component (`pdf.component.spec.ts`)

**Propósito**: Visualiza archivos PDF de facturas con navegación y zoom.

#### Funcionalidades Testeadas:

##### Carga de PDF
- ✅ Carga PDF en `ngOnInit`
- ✅ Recarga en `ngOnChanges`
- ✅ Configura worker correctamente
- ✅ Maneja SafeResourceUrl

##### Navegación
- ✅ Avanza a siguiente página
- ✅ Retrocede a página anterior
- ✅ Respeta límites (primera/última página)

##### Zoom
- ✅ Incrementa zoom con `zoomIn()`
- ✅ Decrementa zoom con `zoomOut()`
- ✅ Límite mínimo de zoom (0.2)
- ✅ Mantiene zoom al cambiar página

**Ejemplo de Prueba:**
```typescript
it('debería avanzar a la siguiente página', () => {
  component.pdfDoc = mockPdfDoc;
  component.pageNum = 1;
  component.totalPages = 3;
  spyOn(component, 'renderPage');
  
  component.nextPage();

  expect(component.pageNum).toBe(2);
  expect(component.renderPage).toHaveBeenCalled();
});
```

##### Renderizado
- ✅ Renderiza página actual
- ✅ Ajusta canvas al viewport
- ✅ No renderiza sin documento

**Casos de Uso:**
1. Visualización de facturas PDF
2. Revisión de documentos sin descargar
3. Verificación rápida de contenido

---

### 7. Header Component (`header.component.spec.ts`)

**Propósito**: Componente reutilizable de encabezado con título y botones de acción.

#### Funcionalidades Testeadas:

##### Inputs
- ✅ Título vacío por defecto
- ✅ Acepta título personalizado
- ✅ Acepta icono de título
- ✅ Clases CSS personalizables
- ✅ Array de botones

##### Eventos
- ✅ Emite evento al hacer clic
- ✅ Distingue entre diferentes acciones
- ✅ Permite múltiples suscripciones

##### Renderizado
- ✅ Muestra título en template
- ✅ Renderiza icono de título
- ✅ Renderiza botones
- ✅ Muestra badges en botones

**Ejemplo de Prueba:**
```typescript
it('debería emitir evento cuando se hace clic en un botón', () => {
  spyOn(component.buttonClick, 'emit');
  
  component.onButtonClick('add');
  
  expect(component.buttonClick.emit).toHaveBeenCalledWith('add');
});
```

##### HeaderButton Interface
- ✅ Propiedades requeridas (icon, action)
- ✅ Propiedades opcionales (class, iconOnly, badge)
- ✅ Múltiples configuraciones

**Casos de Uso:**
1. Encabezado consistente en todas las páginas
2. Acciones rápidas desde el header
3. Notificaciones visuales con badges

---

## Ejecución de Pruebas

### Comandos Disponibles

#### Ejecutar todas las pruebas
```bash
npm test
```

#### Ejecutar pruebas con cobertura
```bash
ng test --code-coverage
```

#### Ejecutar pruebas en modo watch
```bash
ng test --watch
```

#### Ejecutar pruebas de un archivo específico
```bash
ng test --include='**/alertas.spec.ts'
```

#### Ejecutar pruebas sin navegador (CI/CD)
```bash
ng test --browsers=ChromeHeadless --watch=false
```

### Interpretación de Resultados

#### Salida Exitosa
```
Chrome Headless 120.0.0.0 (Windows 10): Executed 95 of 95 SUCCESS (5.234 secs / 4.891 secs)
TOTAL: 95 SUCCESS
```

#### Con Cobertura
```
=============================== Coverage summary ===============================
Statements   : 85% ( 340/400 )
Branches     : 78% ( 156/200 )
Functions    : 82% ( 82/100 )
Lines        : 84% ( 315/375 )
================================================================================
```

---

## Mejores Prácticas

### 1. Estructura de Pruebas

```typescript
describe('ComponentName', () => {
  // Setup
  beforeEach(() => {
    // Configuración común
  });

  describe('metodo1', () => {
    it('debería hacer X cuando Y', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### 2. Nomenclatura

- ✅ **Describe**: Nombre del componente/servicio
- ✅ **It**: Descripción en español del comportamiento esperado
- ✅ **Debe ser específico**: "debería generar alerta D0 para factura pendiente"
- ❌ **Evitar genéricos**: "should work"

### 3. Principios AAA

**Arrange - Act - Assert**

```typescript
it('debería filtrar facturas pendientes', () => {
  // Arrange: Preparar datos
  const facturas = [
    { id: 1, estado: 'pendiente' },
    { id: 2, estado: 'aprobada' }
  ];

  // Act: Ejecutar acción
  const resultado = pipe.transform(facturas);

  // Assert: Verificar resultado
  expect(resultado.length).toBe(1);
  expect(resultado[0].id).toBe(1);
});
```

### 4. Mocks y Spies

```typescript
// Mock de servicio
const mockService = jasmine.createSpyObj('Service', ['method1', 'method2']);

// Spy en método
spyOn(component, 'método').and.returnValue(valor);

// Verificar llamadas
expect(mockService.method1).toHaveBeenCalled();
expect(mockService.method1).toHaveBeenCalledWith(arg1, arg2);
```

### 5. Pruebas Asíncronas

```typescript
// Con async/await
it('debería cargar datos', async () => {
  const datos = await service.getData();
  expect(datos).toBeDefined();
});

// Con done callback
it('debería emitir evento', (done) => {
  component.evento.subscribe(valor => {
    expect(valor).toBe('esperado');
    done();
  });
});
```

### 6. Cobertura de Casos

- ✅ **Happy path**: Caso normal esperado
- ✅ **Edge cases**: Límites y casos extremos
- ✅ **Error handling**: Manejo de errores
- ✅ **Null/undefined**: Valores nulos
- ✅ **Arrays vacíos**: Colecciones sin elementos

### 7. Independencia

- ✅ Cada prueba debe ser independiente
- ✅ No depender del orden de ejecución
- ✅ Limpiar estado después de cada prueba
- ✅ Usar `beforeEach` y `afterEach` apropiadamente

### 8. Aserciones Claras

```typescript
// ✅ Bueno
expect(facturas.length).toBe(3);
expect(factura.estado).toBe('pendiente');

// ❌ Evitar
expect(result).toBeTruthy();
expect(data).toBeDefined();
```

---

## Integración Continua

### GitHub Actions (ejemplo)

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm run test:ci
      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

---

## Mantenimiento

### Actualizar Pruebas

1. **Cuando se agrega funcionalidad**:
   - Escribir prueba primero (TDD)
   - Implementar código
   - Verificar que la prueba pase

2. **Cuando se modifica código**:
   - Actualizar pruebas afectadas
   - Verificar que no se rompa nada más
   - Mantener cobertura

3. **Refactoring**:
   - Las pruebas deben seguir pasando
   - Si se rompen, revisar si el comportamiento cambió
   - Actualizar solo si fue intencional

---

## Recursos Adicionales

### Documentación Oficial

- [Jasmine Documentation](https://jasmine.github.io/)
- [Angular Testing Guide](https://angular.io/guide/testing)
- [Karma Configuration](https://karma-runner.github.io/latest/config/configuration-file.html)

### Herramientas

- **Karma**: Test runner
- **Jasmine**: Framework de testing
- **Coverage Istanbul**: Reporte de cobertura
- **Chrome Headless**: Navegador para CI/CD

---

## Conclusión

Este proyecto cuenta con **95 pruebas unitarias** que cubren los componentes críticos del sistema:

- ✅ Servicios de negocio (Alertas, Database, Firebase)
- ✅ Guards de seguridad
- ✅ Pipes de transformación
- ✅ Componentes de UI

La metodología TDD aplicada garantiza:
- 🎯 Código confiable y mantenible
- 🐛 Detección temprana de bugs
- 📚 Documentación actualizada
- 🔄 Refactoring seguro

### Próximos Pasos

1. **Aumentar cobertura** a páginas principales (Dashboard, Invoices, Reports)
2. **Pruebas de integración** entre componentes
3. **Pruebas E2E** con Cypress o Playwright
4. **Performance testing** con Lighthouse

---

**Última actualización**: 23 de Octubre, 2025  
**Versión del proyecto**: 0.0.1  
**Framework de testing**: Jasmine 5.12.0 + Karma 6.4.4
