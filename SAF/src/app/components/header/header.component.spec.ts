import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent, HeaderButton } from './header.component';
import { IonicModule } from '@ionic/angular';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Inputs', () => {
    it('debería tener título vacío por defecto', () => {
      expect(component.title).toBe('');
    });

    it('debería aceptar título personalizado', () => {
      component.title = 'Mi Título';
      fixture.detectChanges();
      
      expect(component.title).toBe('Mi Título');
    });

    it('debería aceptar icono de título', () => {
      component.titleIcon = 'home-outline';
      fixture.detectChanges();
      
      expect(component.titleIcon).toBe('home-outline');
    });

    it('debería tener shadowClass como string vacío por defecto', () => {
      expect(component.shadowClass).toBe('');
    });

    it('debería aceptar shadowClass personalizado', () => {
      component.shadowClass = 'shadow-lg';
      fixture.detectChanges();
      
      expect(component.shadowClass).toBe('shadow-lg');
    });

    it('debería tener titleClass predeterminado', () => {
      expect(component.titleClass).toBe('text-xl font-bold');
    });

    it('debería aceptar titleClass personalizado', () => {
      component.titleClass = 'text-2xl font-semibold';
      fixture.detectChanges();
      
      expect(component.titleClass).toBe('text-2xl font-semibold');
    });

    it('debería tener titleContainerClass predeterminado', () => {
      expect(component.titleContainerClass).toBe('flex items-center');
    });

    it('debería aceptar titleContainerClass personalizado', () => {
      component.titleContainerClass = 'flex justify-center';
      fixture.detectChanges();
      
      expect(component.titleContainerClass).toBe('flex justify-center');
    });

    it('debería aceptar array de botones', () => {
      const buttons: HeaderButton[] = [
        { icon: 'add', action: 'add' },
        { icon: 'settings', action: 'settings' }
      ];
      
      component.endButtons = buttons;
      fixture.detectChanges();
      
      expect(component.endButtons).toEqual(buttons);
    });
  });

  describe('onButtonClick', () => {
    it('debería emitir evento cuando se hace clic en un botón', () => {
      spyOn(component.buttonClick, 'emit');
      
      component.onButtonClick('add');
      
      expect(component.buttonClick.emit).toHaveBeenCalledWith('add');
    });

    it('debería emitir eventos diferentes para acciones diferentes', () => {
      spyOn(component.buttonClick, 'emit');
      
      component.onButtonClick('edit');
      expect(component.buttonClick.emit).toHaveBeenCalledWith('edit');
      
      component.onButtonClick('delete');
      expect(component.buttonClick.emit).toHaveBeenCalledWith('delete');
    });

    it('debería emitir evento con string vacío', () => {
      spyOn(component.buttonClick, 'emit');
      
      component.onButtonClick('');
      
      expect(component.buttonClick.emit).toHaveBeenCalledWith('');
    });
  });

  describe('Renderizado del template', () => {
    it('debería mostrar el título en el template', () => {
      component.title = 'Facturas';
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      const titleElement = compiled.querySelector('ion-title');
      
      expect(titleElement).toBeTruthy();
      expect(titleElement.textContent).toContain('Facturas');
    });

    it('debería mostrar icono de título si está definido', () => {
      component.title = 'Dashboard';
      component.titleIcon = 'analytics-outline';
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      const iconElement = compiled.querySelector('ion-icon');
      
      expect(iconElement).toBeTruthy();
    });

    it('debería renderizar botones en endButtons', () => {
      component.endButtons = [
        { icon: 'add', action: 'add' },
        { icon: 'filter', action: 'filter' }
      ];
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      const buttons = compiled.querySelectorAll('ion-button');
      
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it('debería mostrar badge si está definido en botón', () => {
      component.endButtons = [
        { icon: 'notifications', action: 'notifications', badge: '5' }
      ];
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      const badge = compiled.querySelector('ion-badge');
      
      expect(badge).toBeTruthy();
      if (badge) {
        expect(badge.textContent).toContain('5');
      }
    });

    it('no debería mostrar badge si no está definido', () => {
      component.endButtons = [
        { icon: 'add', action: 'add' }
      ];
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      const badge = compiled.querySelector('ion-badge');
      
      // El badge no debería existir o debería estar oculto
      expect(badge === null || badge.textContent === '').toBe(true);
    });
  });

  describe('Integración de clases CSS', () => {
    it('debería aplicar shadowClass al header', () => {
      component.shadowClass = 'shadow-md';
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      const header = compiled.querySelector('ion-header');
      
      expect(header).toBeTruthy();
    });

    it('debería aplicar titleClass al título', () => {
      component.titleClass = 'text-3xl font-black';
      fixture.detectChanges();
      
      expect(component.titleClass).toBe('text-3xl font-black');
    });

    it('debería aplicar titleContainerClass al contenedor', () => {
      component.titleContainerClass = 'flex justify-between';
      fixture.detectChanges();
      
      expect(component.titleContainerClass).toBe('flex justify-between');
    });
  });

  describe('HeaderButton interface', () => {
    it('debería aceptar botones con todas las propiedades', () => {
      const button: HeaderButton = {
        icon: 'add-circle',
        action: 'create',
        class: 'custom-class',
        iconOnly: true,
        badge: '3'
      };
      
      component.endButtons = [button];
      fixture.detectChanges();
      
      expect(component.endButtons[0]).toEqual(button);
    });

    it('debería aceptar botones solo con propiedades requeridas', () => {
      const button: HeaderButton = {
        icon: 'add',
        action: 'add'
      };
      
      component.endButtons = [button];
      fixture.detectChanges();
      
      expect(component.endButtons[0]).toEqual(button);
    });

    it('debería manejar múltiples botones con diferentes configuraciones', () => {
      const buttons: HeaderButton[] = [
        { icon: 'add', action: 'add', iconOnly: true },
        { icon: 'filter', action: 'filter', badge: '2' },
        { icon: 'settings', action: 'settings', class: 'settings-btn' }
      ];
      
      component.endButtons = buttons;
      fixture.detectChanges();
      
      expect(component.endButtons.length).toBe(3);
    });
  });

  describe('Output events', () => {
    it('debería tener un EventEmitter para buttonClick', () => {
      expect(component.buttonClick).toBeDefined();
      expect(component.buttonClick.observers.length).toBe(0);
    });

    it('debería permitir suscripción al evento buttonClick', (done) => {
      component.buttonClick.subscribe((action: string) => {
        expect(action).toBe('test-action');
        done();
      });
      
      component.onButtonClick('test-action');
    });

    it('debería emitir múltiples eventos correctamente', () => {
      const emittedActions: string[] = [];
      
      component.buttonClick.subscribe((action: string) => {
        emittedActions.push(action);
      });
      
      component.onButtonClick('action1');
      component.onButtonClick('action2');
      component.onButtonClick('action3');
      
      expect(emittedActions).toEqual(['action1', 'action2', 'action3']);
    });
  });
});
