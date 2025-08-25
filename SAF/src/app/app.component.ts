import { addIcons } from 'ionicons';
import { documentTextOutline, timeOutline, checkmarkCircleOutline, closeCircleOutline, calendarOutline, alertCircleOutline, warningOutline, homeOutline, checkmarkDoneOutline, cubeOutline, barChartOutline, peopleOutline, settingsOutline, businessOutline, createOutline, trashOutline, addCircleOutline, listOutline, closeCircle, searchOutline } from 'ionicons/icons';
import { Component } from '@angular/core';
import { DatabaseService } from './services/database.service';
import { IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';


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
  // IonButtons y IonMenuButton eliminados porque ya no se usan
  IonLabel,
  IonIcon
  ],
})
export class AppComponent {
  constructor(private dbService: DatabaseService) {
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
  }
}