import { addIcons } from 'ionicons';
import { documentTextOutline, arrowBackOutline,timeOutline, checkmarkCircleOutline, closeCircleOutline, calendarOutline, alertCircleOutline, warningOutline, homeOutline, checkmarkDoneOutline, cubeOutline, barChartOutline, peopleOutline, settingsOutline, businessOutline, createOutline, trashOutline, addCircleOutline, listOutline, closeCircle, searchOutline, pieChartOutline, helpCircleOutline, analyticsOutline, helpCircle, flashOutline, sparklesOutline } from 'ionicons/icons';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { IonApp, IonRouterOutlet, IonMenu, IonContent, IonItem, IonIcon, IonSplitPane, IonButton, IonMenuToggle } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';

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
    IonMenuToggle
  ],
})
export class AppComponent implements AfterViewInit {
  @ViewChild(IonMenu) menu?: IonMenu;
  constructor(private router: Router, private menuCtrl: MenuController) {
    addIcons({arrowBackOutline,homeOutline,documentTextOutline,barChartOutline,analyticsOutline,peopleOutline,settingsOutline,sparklesOutline,helpCircleOutline,businessOutline,flashOutline,checkmarkDoneOutline,cubeOutline,pieChartOutline,timeOutline,checkmarkCircleOutline,closeCircleOutline,calendarOutline,alertCircleOutline,warningOutline,createOutline,trashOutline,addCircleOutline,listOutline,closeCircle,searchOutline,});
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