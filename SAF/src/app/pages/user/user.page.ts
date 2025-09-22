import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar, IonIcon, IonItem, IonLabel, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { person, mail, call, business, calendar, settings, notifications, shieldCheckmark, chevronForward, documentText, checkmarkCircle, create, logOut, time, closeCircle, download, helpCircle, chevronDown } from 'ionicons/icons';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonButton,
    CommonModule,
    FormsModule
  ]
})
export class UserPage implements OnInit {

  constructor(private router: Router) {
    addIcons({
      person,
      mail,
      call,
      business,
      calendar,
      settings,
      notifications,
      shieldCheckmark,
      chevronForward,
      documentText,
      checkmarkCircle,
      create,
      logOut,
      time,
      closeCircle,
      download,
      helpCircle,
      chevronDown
    });
  }

  ngOnInit() {
  }

  // Método para navegar a la página de tips
  goToTips() {
    this.router.navigate(['/tips']);
  }

}
