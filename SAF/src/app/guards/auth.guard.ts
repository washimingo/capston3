import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Firedb } from '../services/Firebase/firedb';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const firedb = inject(Firedb);
  const router = inject(Router);

  // Esperar a que Firebase verifique el estado de autenticación
  return firedb.getAuthState().pipe(
    take(1), // Solo tomar el primer valor
    map(user => {
      if (user) {
        return true;
      }
      
      // Redirigir a la página de autenticación si no hay usuario
      router.navigate(['/authentication']);
      return false;
    })
  );
};
