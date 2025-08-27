import { addIcons } from 'ionicons';
import { documentTextOutline, timeOutline, checkmarkCircleOutline, closeCircleOutline, calendarOutline, alertCircleOutline, warningOutline, homeOutline, checkmarkDoneOutline, cubeOutline, barChartOutline, peopleOutline, settingsOutline, businessOutline, createOutline, trashOutline, addCircleOutline, listOutline, closeCircle, searchOutline } from 'ionicons/icons';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon } from '@ionic/angular/standalone';
// ...existing code...

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
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    RouterModule,
    IonLabel,
  IonIcon
  ],
})
export class AppComponent {
  constructor(private router: Router) {
    addIcons({
      documentTextOutline,
      timeOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      calendarOutline,
      alertCircleOutline,
      warningOutline,
      homeOutline,
      checkmarkDoneOutline,
      cubeOutline,
      barChartOutline,
      peopleOutline,
      settingsOutline,
      businessOutline,
      createOutline,
      trashOutline,
      addCircleOutline,
      listOutline,
      closeCircle,
      searchOutline
    });
    // Aplicar modo oscuro si está guardado en localStorage
    const dark = localStorage.getItem('saf-dark-mode');
    if (dark === 'true') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  irAHomeYRecargar() {
    // Navega a /home y recarga la página para refrescar datos
    this.router.navigateByUrl('/home').then(() => {
      window.location.reload();
    });
  }
}
