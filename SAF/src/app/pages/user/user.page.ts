import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { addIcons } from 'ionicons';
import { person, mail, call, business, calendar, chevronForward, documentText, checkmarkCircle, logOut, time, closeCircle, chevronDown, personCircleOutline, barChartOutline, personOutline } from 'ionicons/icons';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    CommonModule,
    FormsModule,
    HeaderComponent
  ]
})
export class UserPage implements OnInit {

  constructor() {
    addIcons({
      person,
      mail,
      call,
      business,
      calendar,
      chevronForward,
      documentText,
      checkmarkCircle,
      logOut,
      time,
      closeCircle,
      chevronDown,
      personCircleOutline,
      barChartOutline,
      personOutline
    });
  }

  ngOnInit() {
  }
}