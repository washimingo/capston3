import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { Firedb } from '../services/Firebase/firedb';
import { Observable, of } from 'rxjs';
import { User } from 'firebase/auth';

describe('authGuard', () => {
  let firedbService: jasmine.SpyObj<Firedb>;
  let router: jasmine.SpyObj<Router>;
  let mockUser: User;

  beforeEach(() => {
    // Mock User
    mockUser = {
      uid: 'test-uid',
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
    } as User;

    // Mock Firedb service
    const firedbSpy = jasmine.createSpyObj('Firedb', ['getAuthState']);

    // Mock Router
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Firedb, useValue: firedbSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    firedbService = TestBed.inject(Firedb) as jasmine.SpyObj<Firedb>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('debería permitir acceso cuando hay usuario autenticado', (done) => {
    firedbService.getAuthState.and.returnValue(of(mockUser));

    TestBed.runInInjectionContext(() => {
      const result = authGuard({} as any, {} as any);

      if (result instanceof Observable) {
        result.subscribe((canActivate: boolean | any) => {
          expect(canActivate).toBe(true);
          expect(router.navigate).not.toHaveBeenCalled();
          done();
        });
      } else {
        expect(result).toBe(true);
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      }
    });
  });

  it('debería denegar acceso y redirigir cuando no hay usuario autenticado', (done) => {
    firedbService.getAuthState.and.returnValue(of(null));

    TestBed.runInInjectionContext(() => {
      const result = authGuard({} as any, {} as any);

      if (result instanceof Observable) {
        result.subscribe((canActivate: boolean | any) => {
          expect(canActivate).toBe(false);
          expect(router.navigate).toHaveBeenCalledWith(['/authentication']);
          done();
        });
      } else {
        expect(result).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/authentication']);
        done();
      }
    });
  });

  it('debería tomar solo el primer valor del estado de autenticación', (done) => {
    let emissionCount = 0;
    firedbService.getAuthState.and.returnValue(
      of(mockUser, mockUser, mockUser)
    );

    TestBed.runInInjectionContext(() => {
      const result = authGuard({} as any, {} as any);

      if (result instanceof Observable) {
        result.subscribe(() => {
          emissionCount++;
          setTimeout(() => {
            expect(emissionCount).toBe(1);
            done();
          }, 100);
        });
      } else {
        done();
      }
    });
  });

  it('debería funcionar correctamente con múltiples verificaciones', (done) => {
    firedbService.getAuthState.and.returnValue(of(mockUser));

    TestBed.runInInjectionContext(() => {
      const result1 = authGuard({} as any, {} as any);
      const result2 = authGuard({} as any, {} as any);

      if (result1 instanceof Observable && result2 instanceof Observable) {
        result1.subscribe((canActivate: boolean | any) => {
          expect(canActivate).toBe(true);
          
          result2.subscribe((canActivate2: boolean | any) => {
            expect(canActivate2).toBe(true);
            done();
          });
        });
      } else {
        done();
      }
    });
  });
});
