import { addIcons } from 'ionicons';
import { documentTextOutline, timeOutline, checkmarkCircleOutline, closeCircleOutline, calendarOutline, alertCircleOutline, warningOutline, homeOutline, checkmarkDoneOutline, cubeOutline, barChartOutline, peopleOutline, settingsOutline, businessOutline, createOutline, trashOutline, addCircleOutline, listOutline, closeCircle, searchOutline, pieChartOutline, helpCircleOutline, analyticsOutline, helpCircle } from 'ionicons/icons';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonContent, IonItem, IonIcon, IonSplitPane, IonButton, IonMenuToggle, IonButtons } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';
import { HeaderComponent } from './components/header/header.component';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonContent,
    IonItem,
    RouterModule,
    IonIcon,
    IonSplitPane,
    IonButton,
    IonMenuToggle,
    IonButtons
  ],
})
export class AppComponent implements AfterViewInit {
  @ViewChild(IonMenu) menu?: IonMenu;
  constructor(private router: Router, private menuCtrl: MenuController) {
    addIcons({homeOutline,documentTextOutline,checkmarkDoneOutline,cubeOutline,barChartOutline,analyticsOutline,peopleOutline,settingsOutline,helpCircleOutline,businessOutline,pieChartOutline,timeOutline,checkmarkCircleOutline,closeCircleOutline,calendarOutline,alertCircleOutline,warningOutline,createOutline,trashOutline,addCircleOutline,listOutline,closeCircle,searchOutline});
    // Aplicar modo oscuro si está guardado en localStorage
    const dark = localStorage.getItem('saf-dark-mode');
    if (dark === 'true') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  this.setMenuType();
  window.addEventListener('resize', this.setMenuType.bind(this));
  }
  
  menuType: 'overlay' | 'side' = 'side';
  
  setMenuType() {
    this.menuType = window.innerWidth <= 1024 ? 'overlay' : 'side';
  }

  ngAfterViewInit() {
    this.setMenuType();
  }
  // Método eliminado para evitar recargas y mantener SPA
}