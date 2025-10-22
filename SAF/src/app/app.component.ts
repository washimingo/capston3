import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { IonApp, IonRouterOutlet, IonMenu, IonContent, IonItem, IonIcon, IonSplitPane, IonButton, IonMenuToggle } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';
import { IconsComponent } from './components/icons/icons.component';

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
    IconsComponent
  ],
})
export class AppComponent implements AfterViewInit {
  @ViewChild(IonMenu) menu?: IonMenu;
  
  constructor(private router: Router, private menuCtrl: MenuController) {
    // Los iconos ahora se registran en IconsComponent
  }
  
  menuType: 'overlay' | 'side' = 'side';
  
  setMenuType() {
    this.menuType = window.innerWidth <= 1024 ? 'overlay' : 'side';
  }

  ngAfterViewInit() {
    this.setMenuType();
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  // Método eliminado para evitar recargas y mantener SPA
}