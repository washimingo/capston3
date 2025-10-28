import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { environment } from './environments/environment';
import { Animation } from '@ionic/angular';

// Register Swiper custom elements
import { register } from 'swiper/element/bundle';
register();

// Función de animación personalizada para navegación de páginas
const customPageTransition = (_: HTMLElement, opts: any): Animation => {
  const DURATION = 400;
  const animationCtrl = (window as any).Ionic.createAnimation;
  const rootTransition = animationCtrl();

  // Página que entra
  const enteringPage = animationCtrl()
    .addElement(opts.enteringEl)
    .duration(DURATION)
    .easing('cubic-bezier(0.4, 0.0, 0.2, 1)')
    .fromTo('opacity', '0', '1')
    .fromTo('transform', 'translateX(30px)', 'translateX(0px)');

  // Página que sale
  const leavingPage = animationCtrl()
    .addElement(opts.leavingEl)
    .duration(DURATION)
    .easing('cubic-bezier(0.4, 0.0, 0.2, 1)')
    .fromTo('opacity', '1', '0')
    .fromTo('transform', 'translateX(0px)', 'translateX(-30px)');

  return rootTransition.addAnimation([enteringPage, leavingPage]);
};

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
    // Activar animaciones suaves con configuración personalizada
    provideIonicAngular({ 
      animated: true,
      navAnimation: customPageTransition,
      mode: 'md' // Modo Material Design para animaciones consistentes
    }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    // No se registran providers de Firebase: usar directamente el SDK modular (getAuth, getFirestore, etc.)
  ],
});
