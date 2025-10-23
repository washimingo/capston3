import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { environment } from './environments/environment';

// Register Swiper custom elements
import { register } from 'swiper/element/bundle';
register();

// Inicializar Firebase usando el SDK Modular (sin AngularFire)
const firebaseApp = initializeApp(environment.firebaseConfig);
// Configurar persistencia de autenticación (opcional, recomendado para web)
const auth = getAuth(firebaseApp);
setPersistence(auth, browserLocalPersistence).catch(() => {
  // Ignorar errores de persistencia (por ejemplo, en entornos sin almacenamiento disponible)
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // Desactivar animaciones nativas de Ionic (transiciones, overlays, etc.)
    provideIonicAngular({ animated: false }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    // No se registran providers de Firebase: usar directamente el SDK modular (getAuth, getFirestore, etc.)
  ],
});
