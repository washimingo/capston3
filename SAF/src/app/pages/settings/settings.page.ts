import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent,
  IonIcon
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { addIcons } from 'ionicons';
import { 
  settingsOutline,
  constructOutline,
  chevronForwardOutline,
  notificationsOutline,
  phonePortraitOutline,
  mailOutline,
  personOutline,
  personCircleOutline,
  informationCircleOutline,
  codeOutline,
  helpCircleOutline,
  saveOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonContent,
    IonIcon,
    HeaderComponent
  ]
})
export class SettingsPage implements OnInit {

  constructor(private router: Router) {
    addIcons({
      settingsOutline,
      constructOutline,
      chevronForwardOutline,
      notificationsOutline,
      phonePortraitOutline,
      mailOutline,
      personOutline,
      personCircleOutline,
      informationCircleOutline,
      codeOutline,
      helpCircleOutline,
      saveOutline
    });
  }

  ngOnInit() {
  }

  navigateToTips(): void {
    this.router.navigate(['/tips']);
  }
}