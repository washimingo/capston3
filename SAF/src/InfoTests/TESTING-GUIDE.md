# Guía Rápida de Testing - SAF

## 🚀 Inicio Rápido

### Instalación
```bash
# Instalar dependencias
npm install

# Verificar configuración
ng version
```

### Ejecutar Tests
```bash
# Todas las pruebas
npm test

# Con cobertura
npm run test -- --code-coverage

# Sin navegador (CI/CD)
npm run test -- --browsers=ChromeHeadless --watch=false

# Test específico
npm run test -- --include='**/alertas.spec.ts'
```

---

## 📊 Ver Resultados

### Reporte de Cobertura
```bash
# Ejecutar con cobertura
npm run test -- --code-coverage

# Abrir reporte HTML
start coverage/app/index.html   # Windows
open coverage/app/index.html    # Mac
xdg-open coverage/app/index.html # Linux
```

### Interpretación de Cobertura

```
Statements: 85%   → 85% de las líneas ejecutadas
Branches: 78%     → 78% de las condiciones evaluadas
Functions: 82%    → 82% de las funciones llamadas
Lines: 84%        → 84% de las líneas cubiertas
```

**Meta**: > 80% en todas las métricas

---

## 🔍 Debugging de Tests

### En Chrome
```bash
npm test
# Clic en "DEBUG" en la ventana de Karma
# Abrir DevTools (F12)
# Establecer breakpoints en la pestaña "Sources"
```

### Con VS Code
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "attach",
      "name": "Karma Debug",
      "address": "localhost",
      "port": 9876,
      "pathMapping": {
        "/": "${workspaceRoot}",
        "/base/": "${workspaceRoot}/"
      }
    }
  ]
}
```

---

## 📝 Plantillas de Tests

### Servicio Básico
```typescript
import { TestBed } from '@angular/core/testing';
import { MiServicio } from './mi-servicio';

describe('MiServicio', () => {
  let service: MiServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MiServicio]
    });
    service = TestBed.inject(MiServicio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('metodo', () => {
    it('debería hacer X', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = service.metodo(input);
      
      // Assert
      expect(result).toBe('esperado');
    });
  });
});
```

### Componente con Inputs/Outputs
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiComponente } from './mi-componente';

describe('MiComponente', () => {
  let component: MiComponente;
  let fixture: ComponentFixture<MiComponente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiComponente]
    }).compileComponents();

    fixture = TestBed.createComponent(MiComponente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería emitir evento', () => {
    spyOn(component.eventoOutput, 'emit');
    
    component.accion();
    
    expect(component.eventoOutput.emit).toHaveBeenCalledWith('valor');
  });
});
```

### Pipe
```typescript
import { TestBed } from '@angular/core/testing';
import { MiPipe } from './mi-pipe';

describe('MiPipe', () => {
  let pipe: MiPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MiPipe]
    });
    pipe = TestBed.inject(MiPipe);
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('debería transformar valor', () => {
    const input = [1, 2, 3];
    const result = pipe.transform(input);
    expect(result.length).toBe(3);
  });
});
```

### Guard
```typescript
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { miGuard } from './mi.guard';
import { Observable, of } from 'rxjs';

describe('miGuard', () => {
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    });

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('debería permitir acceso', (done) => {
    TestBed.runInInjectionContext(() => {
      const result = miGuard({} as any, {} as any);

      if (result instanceof Observable) {
        result.subscribe((canActivate: boolean) => {
          expect(canActivate).toBe(true);
          done();
        });
      }
    });
  });
});
```

---

## 🎯 Casos de Prueba Comunes

### Arrays
```typescript
// Array vacío
expect([]).toEqual([]);
expect(array.length).toBe(0);

// Contiene elemento
expect(array).toContain('valor');

// Todos los elementos
expect(array.every(x => x > 0)).toBe(true);

// Algún elemento
expect(array.some(x => x === 'test')).toBe(true);
```

### Objetos
```typescript
// Igualdad profunda
expect(obj).toEqual({ prop: 'valor' });

// Tiene propiedad
expect(obj).toHaveProperty('prop');

// Tipo de dato
expect(typeof obj.prop).toBe('string');
```

### Promesas
```typescript
// Con async/await
it('debería resolver promesa', async () => {
  const result = await service.asyncMethod();
  expect(result).toBe('valor');
});

// Con then
it('debería resolver promesa', (done) => {
  service.asyncMethod().then(result => {
    expect(result).toBe('valor');
    done();
  });
});
```

### Observables
```typescript
// Suscripción simple
it('debería emitir valor', (done) => {
  service.observable$.subscribe(value => {
    expect(value).toBe('esperado');
    done();
  });
});

// Con múltiples valores
it('debería emitir múltiples valores', (done) => {
  const values: any[] = [];
  
  service.observable$.subscribe({
    next: (value) => values.push(value),
    complete: () => {
      expect(values).toEqual([1, 2, 3]);
      done();
    }
  });
});
```

### Errores
```typescript
// Debe lanzar error
expect(() => service.metodoQueError()).toThrow();
expect(() => service.metodoQueError()).toThrowError('mensaje');

// Promesa rechazada
it('debería rechazar', async () => {
  try {
    await service.metodoPeligroso();
    fail('Debería haber lanzado error');
  } catch (error: any) {
    expect(error.message).toContain('esperado');
  }
});
```

---

## 🛠️ Mocks y Spies

### Spy en Método
```typescript
spyOn(service, 'metodo');
expect(service.metodo).toHaveBeenCalled();
expect(service.metodo).toHaveBeenCalledTimes(2);
expect(service.metodo).toHaveBeenCalledWith(arg1, arg2);
```

### Mock con Retorno
```typescript
spyOn(service, 'metodo').and.returnValue('valor');
spyOn(service, 'asyncMetodo').and.returnValue(Promise.resolve('valor'));
spyOn(service, 'obsMetodo').and.returnValue(of('valor'));
```

### Crear Mock Completo
```typescript
const mockService = jasmine.createSpyObj('Service', [
  'metodo1',
  'metodo2'
]);

mockService.metodo1.and.returnValue('valor1');

TestBed.configureTestingModule({
  providers: [
    { provide: MiServicio, useValue: mockService }
  ]
});
```

---

## ⚡ Atajos y Tips

### Solo ejecutar un test
```typescript
fit('solo este test', () => {
  // Este es el único que se ejecutará
});
```

### Omitir un test
```typescript
xit('este test se omite', () => {
  // Este test no se ejecutará
});
```

### Agrupar tests
```typescript
describe('Grupo 1', () => {
  fdescribe('Solo este grupo', () => {
    // Solo este grupo se ejecuta
  });
  
  xdescribe('Este grupo se omite', () => {
    // Este grupo no se ejecuta
  });
});
```

### Timeout personalizado
```typescript
it('test largo', (done) => {
  // Test que toma tiempo
  done();
}, 10000); // 10 segundos
```

---

## 🐛 Troubleshooting

### Error: "Can't bind to X since it isn't a known property"
```typescript
// Solución: Importar el módulo necesario
await TestBed.configureTestingModule({
  imports: [ComponenteQueUsa, FormsModule, IonicModule]
});
```

### Error: "No provider for X"
```typescript
// Solución: Proveer el servicio
TestBed.configureTestingModule({
  providers: [ServicioNecesario]
});
```

### Error: "Cannot read property 'nativeElement' of undefined"
```typescript
// Solución: Usar ViewChild con static: false
@ViewChild('elemento', { static: false }) elemento!: ElementRef;

// O mockearlo en el test
component.elemento = { nativeElement: mockElement };
```

### Tests inconsistentes
```typescript
// Solución: Usar done() para tests asíncronos
it('test asíncrono', (done) => {
  service.async().then(result => {
    expect(result).toBe('esperado');
    done(); // ¡Importante!
  });
});
```

---

## 📋 Checklist de Prueba

Antes de hacer commit, verifica:

- [ ] Todas las pruebas pasan
- [ ] Cobertura > 80%
- [ ] Sin tests omitidos (xit, xdescribe)
- [ ] Sin focus tests (fit, fdescribe)
- [ ] Nombres descriptivos en español
- [ ] Arrange-Act-Assert bien definido
- [ ] Mocks y spies limpios
- [ ] Sin console.log olvidados
- [ ] Documentación actualizada

---

## 📚 Comandos Útiles

```bash
# Limpiar cache
npm run test -- --no-cache

# Ejecutar en un navegador específico
npm run test -- --browsers=Firefox

# Generar solo reporte de cobertura
npm run test -- --code-coverage --watch=false

# Ver archivo específico
npm run test -- --include='**/mi-archivo.spec.ts'

# Verbose mode
npm run test -- --progress

# Configuración custom
npm run test -- --karma-config=karma.custom.conf.js
```

---

## 🎓 Recursos de Aprendizaje

### Documentación Oficial
- [Angular Testing](https://angular.io/guide/testing)
- [Jasmine Docs](https://jasmine.github.io/)
- [Karma Docs](https://karma-runner.github.io/)

### Tutoriales Recomendados
- Angular Testing Workshop
- Testing RxJS Observables
- Advanced Mocking Techniques

### Libros
- "Testing Angular Applications" - Corinna Cohn
- "Unit Testing Principles" - Vladimir Khorikov

---

## 💡 Mejores Prácticas Recordatorias

1. **Una aserción por test** (cuando sea posible)
2. **Tests independientes** (no depender de orden)
3. **Nombres descriptivos** ("debería hacer X cuando Y")
4. **Arrange-Act-Assert** (estructura clara)
5. **No testear implementación** (testear comportamiento)
6. **Mocks simples** (no sobre-mockear)
7. **Limpiar después** (afterEach cuando sea necesario)
8. **Tests rápidos** (< 100ms por test idealmente)

---

## 🚨 Errores Comunes a Evitar

❌ Tests que dependen de otros tests  
❌ Tests sin aserciones  
❌ Usar setTimeout en vez de done()  
❌ No limpiar mocks entre tests  
❌ Tests muy largos (> 20 líneas)  
❌ Nombres genéricos ("should work")  
❌ Mockear todo (mockear solo lo necesario)  
❌ Ignorar tests fallidos  

---

**¡Recuerda!**: Un buen test es claro, conciso y confiable. 
Si un test es difícil de escribir, probablemente el código necesita refactoring.

---

**Última actualización**: Octubre 2025  
**Mantenedor**: Equipo SAF
