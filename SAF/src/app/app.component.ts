import { Component, ViewChild, AfterViewInit, inject, HostListener } from '@angular/core';
import { RouterModule, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { IonApp, IonRouterOutlet, IonMenu, IonContent, IonItem, IonIcon, IonSplitPane, IonButton, IonMenuToggle } from '@ionic/angular/standalone';
import { MenuController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { IconsComponent } from './components/icons/icons.component';
import { Firedb } from './services/Firebase/firedb';
import { PageSkeletonComponent } from './components/page-skeleton/page-skeleton.component';
import { LoadingService } from './services/loading/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonContent,
    IonItem,
    RouterModule,
    IonIcon,
    IonSplitPane,
    IonButton,
    IonMenuToggle,
    IconsComponent,
    CommonModule,
    PageSkeletonComponent
  ],
})
export class AppComponent implements AfterViewInit {
  @ViewChild(IonMenu) menu?: IonMenu;
  
  router = inject(Router);
  menuCtrl = inject(MenuController);
  firedb = inject(Firedb);
  loadingService = inject(LoadingService);
  alertController = inject(AlertController);
  
  menuType: 'overlay' | 'side' | 'push' | 'reveal' = 'side';
  showMenu = false;
  isLoading = false;
  
  constructor() {
    // Deshabilitar menú por defecto para evitar parpadeos en la primera carga
    // Se volverá a habilitar según la ruta una vez que termine la navegación
    this.menuCtrl.enable(false, 'main-menu');

    // Mostrar spinner al iniciar navegación
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      // Pequeño delay antes de mostrar el spinner para evitar parpadeos en navegaciones rápidas
      setTimeout(() => {
        if (this.isLoading) { // Solo mostrar si aún está cargando
          this.isLoading = true;
        }
      }, 100);
      this.isLoading = true;
    });

    // Escuchar cambios de ruta para mostrar/ocultar el menú y spinner
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const currentUrl = event.urlAfterRedirects || event.url;
      this.showMenu = !currentUrl.includes('/authentication');
      // Sincronizar también el estado real del menú
      this.menuCtrl.enable(this.showMenu, 'main-menu');
      
      // Ocultar spinner inmediatamente cuando la navegación termina
      this.isLoading = false;
    });
  }
  
  setMenuType() {
    // Usar 'overlay' para animación suave en mobile
    this.menuType = window.innerWidth <= 1024 ? 'overlay' : 'side';
  }

  ngAfterViewInit() {
    this.setMenuType();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setMenuType();
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
    // Cerrar el menú en mobile al navegar con un pequeño delay
    if (this.menuType === 'overlay') {
      setTimeout(() => {
        this.menuCtrl.close('main-menu');
      }, 150);
    }
  }

  async logout() {
    const alert = await this.alertController.create({
      message: '¿Quieres cerrar sesión?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
          handler: () => {
            console.log('Cierre de sesión cancelado');
          }
        },
        {
          text: 'Salir',
          role: 'confirm',
          cssClass: 'alert-button-confirm',
          handler: async () => {
            await this.firedb.logout();
            this.router.navigate(['/authentication']);
          }
        }
      ]
    });

    await alert.present();
  }
}