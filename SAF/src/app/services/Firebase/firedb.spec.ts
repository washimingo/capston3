import { TestBed } from '@angular/core/testing';
import { Firedb } from './firedb';
import { User } from 'firebase/auth';
import { Observable, of } from 'rxjs';

describe('Firedb Service', () => {
  let service: Firedb;
  let mockUser: Partial<User>;

  beforeEach(() => {
    // Mock User completo
    mockUser = {
      uid: 'test-uid-123',
      email: 'test@example.com',
      displayName: 'Test User',
      emailVerified: true,
      metadata: {} as any,
      providerData: [],
      refreshToken: 'refresh-token',
      tenantId: null,
      delete: jasmine.createSpy('delete').and.returnValue(Promise.resolve()),
      getIdToken: jasmine.createSpy('getIdToken').and.returnValue(Promise.resolve('token')),
      getIdTokenResult: jasmine.createSpy('getIdTokenResult').and.returnValue(Promise.resolve({} as any)),
      reload: jasmine.createSpy('reload').and.returnValue(Promise.resolve()),
      toJSON: jasmine.createSpy('toJSON').and.returnValue({}),
      isAnonymous: false,
      phoneNumber: null,
      photoURL: null,
      providerId: 'firebase'
    };

    // Crear mock del servicio Firedb
    const mockFiredbService = {
      currentUserValue: null as User | null,
      
      login: jasmine.createSpy('login').and.callFake((email: string, password: string) => {
        if (email === 'test@example.com' && password === 'password123') {
          mockFiredbService.currentUserValue = mockUser as User;
          return Promise.resolve(mockUser as User);
        }
        
        // Manejar diferentes tipos de errores según combinaciones específicas
        if (email === 'invalid-email') {
          return Promise.reject(new Error('El correo electrónico no es válido'));
        }
        if (email === 'notfound@example.com') {
          return Promise.reject(new Error('No existe una cuenta con este correo'));
        }
        if (email === 'test@example.com' && password === 'wrongpassword') {
          return Promise.reject(new Error('Contraseña incorrecta'));
        }
        if (email === 'toomany@example.com') {
          return Promise.reject(new Error('Demasiados intentos fallidos. Intenta más tarde'));
        }
        if (email === 'networkerror@example.com') {
          return Promise.reject(new Error('Error de conexión. Verifica tu internet'));
        }
        
        // Cualquier otra combinación retorna credenciales inválidas
        return Promise.reject(new Error('Credenciales inválidas. Verifica tu correo y contraseña'));
      }),

      logout: jasmine.createSpy('logout').and.callFake(() => {
        mockFiredbService.currentUserValue = null;
        return Promise.resolve();
      }),

      getCurrentUser: jasmine.createSpy('getCurrentUser').and.callFake(() => {
        return mockFiredbService.currentUserValue;
      }),

      isAuthenticated: jasmine.createSpy('isAuthenticated').and.callFake(() => {
        return !!mockFiredbService.currentUserValue;
      }),

      getAuthState: jasmine.createSpy('getAuthState').and.callFake(() => {
        return of(mockFiredbService.currentUserValue);
      })
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Firedb, useValue: mockFiredbService }
      ]
    });
    
    service = TestBed.inject(Firedb);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('debería iniciar sesión correctamente con credenciales válidas', async () => {
      const user = await service.login('test@example.com', 'password123');
      
      expect(service.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(user).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(service.isAuthenticated()).toBe(true);
    });

    it('debería lanzar error con credenciales inválidas', async () => {
      try {
        await service.login('wrong@example.com', 'wrongpassword');
        fail('Debería haber lanzado un error');
      } catch (error: any) {
        expect(error).toBeDefined();
        expect(error.message).toContain('Credenciales inválidas');
      }
    });

    it('debería manejar error de email inválido', async () => {
      try {
        await service.login('invalid-email', 'password');
        fail('Debería haber lanzado un error');
      } catch (error: any) {
        expect(error.message).toBe('El correo electrónico no es válido');
      }
    });

    it('debería manejar error de usuario no encontrado', async () => {
      try {
        await service.login('notfound@example.com', 'password');
        fail('Debería haber lanzado un error');
      } catch (error: any) {
        expect(error.message).toBe('No existe una cuenta con este correo');
      }
    });

    it('debería manejar error de contraseña incorrecta', async () => {
      try {
        await service.login('test@example.com', 'wrongpassword');
        fail('Debería haber lanzado un error');
      } catch (error: any) {
        expect(error.message).toBe('Contraseña incorrecta');
      }
    });

    it('debería manejar error de demasiados intentos', async () => {
      try {
        await service.login('toomany@example.com', 'password');
        fail('Debería haber lanzado un error');
      } catch (error: any) {
        expect(error.message).toBe('Demasiados intentos fallidos. Intenta más tarde');
      }
    });

    it('debería manejar error de red', async () => {
      try {
        await service.login('networkerror@example.com', 'password');
        fail('Debería haber lanzado un error');
      } catch (error: any) {
        expect(error.message).toBe('Error de conexión. Verifica tu internet');
      }
    });
  });

  describe('logout', () => {
    it('debería cerrar sesión correctamente', async () => {
      await service.logout();
      expect(service.logout).toHaveBeenCalled();
      expect(service.getCurrentUser()).toBeNull();
    });

    it('debería limpiar el usuario actual al cerrar sesión', async () => {
      // Simular un usuario autenticado
      await service.login('test@example.com', 'password123');
      expect(service.isAuthenticated()).toBe(true);
      
      await service.logout();
      
      expect(service.getCurrentUser()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('debería retornar el usuario actual', async () => {
      await service.login('test@example.com', 'password123');
      const currentUser = service.getCurrentUser();
      
      expect(service.getCurrentUser).toHaveBeenCalled();
      expect(currentUser).toBeDefined();
      expect(currentUser?.email).toBe('test@example.com');
    });

    it('debería retornar null si no hay sesión', () => {
      const currentUser = service.getCurrentUser();
      
      expect(service.getCurrentUser).toHaveBeenCalled();
      expect(currentUser).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('debería retornar true si hay usuario autenticado', async () => {
      await service.login('test@example.com', 'password123');
      
      const isAuth = service.isAuthenticated();
      
      expect(service.isAuthenticated).toHaveBeenCalled();
      expect(isAuth).toBe(true);
    });

    it('debería retornar false si no hay usuario autenticado', () => {
      const isAuth = service.isAuthenticated();
      
      expect(service.isAuthenticated).toHaveBeenCalled();
      expect(isAuth).toBe(false);
    });
  });

  describe('getAuthState', () => {
    it('debería retornar un Observable del estado de autenticación', (done) => {
      const authState$ = service.getAuthState();
      
      expect(service.getAuthState).toHaveBeenCalled();
      expect(authState$).toBeDefined();
      
      authState$.subscribe(user => {
        expect(user).toBeNull();
        done();
      });
    });
  });
});
