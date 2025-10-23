import { Component, ViewChild, AfterViewInit, inject } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { IonApp, IonRouterOutlet, IonMenu, IonContent, IonItem, IonIcon, IonSplitPane, IonButton, IonMenuToggle } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { IconsComponent } from './components/icons/icons.component';
import { Firedb } from './services/Firebase/firedb';

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
    CommonModule
  ],
})
export class AppComponent implements AfterViewInit {
  @ViewChild(IonMenu) menu?: IonMenu;
  
  router = inject(Router);
  menuCtrl = inject(MenuController);
  firedb = inject(Firedb);
  
  menuType: 'overlay' | 'side' = 'side';
  showMenu = false;
  
  constructor() {
    // Deshabilitar menú por defecto para evitar parpadeos en la primera carga
    // Se volverá a habilitar según la ruta una vez que termine la navegación
    this.menuCtrl.enable(false, 'main-menu');

    // Escuchar cambios de ruta para mostrar/ocultar el menú
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const currentUrl = event.urlAfterRedirects || event.url;
      this.showMenu = !currentUrl.includes('/authentication');
      // Sincronizar también el estado real del menú
      this.menuCtrl.enable(this.showMenu, 'main-menu');
    });
  }
  
  setMenuType() {
    this.menuType = window.innerWidth <= 1024 ? 'overlay' : 'side';
  }

  ngAfterViewInit() {
    this.setMenuType();
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  async logout() {
    await this.firedb.logout();
    this.router.navigate(['/authentication']);
  }
}