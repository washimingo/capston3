import { addIcons } from 'ionicons';
import { documentTextOutline, timeOutline, checkmarkCircleOutline, closeCircleOutline, calendarOutline, alertCircleOutline, warningOutline, homeOutline, checkmarkDoneOutline, cubeOutline, barChartOutline, peopleOutline, settingsOutline, businessOutline, createOutline, trashOutline, addCircleOutline, listOutline, closeCircle, searchOutline, pieChartOutline, helpCircleOutline, analyticsOutline, helpCircle } from 'ionicons/icons';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonContent, IonItem, IonIcon } from '@ionic/angular/standalone';
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
    HeaderComponent,
  IonIcon
  ],
})
export class AppComponent {
  constructor(private router: Router) {
    addIcons({homeOutline,documentTextOutline,checkmarkDoneOutline,cubeOutline,barChartOutline,analyticsOutline,peopleOutline,settingsOutline,helpCircleOutline,businessOutline,pieChartOutline,timeOutline,checkmarkCircleOutline,closeCircleOutline,calendarOutline,alertCircleOutline,warningOutline,createOutline,trashOutline,addCircleOutline,listOutline,closeCircle,searchOutline});
    // Aplicar modo oscuro si está guardado en localStorage
    const dark = localStorage.getItem('saf-dark-mode');
    if (dark === 'true') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  // Método eliminado para evitar recargas y mantener SPA
}