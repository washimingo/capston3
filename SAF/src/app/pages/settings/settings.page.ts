import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonButton, 
  IonButtons, 
  IonContent,
  IonHeader, 
  IonIcon, 
  IonMenuButton, 
  IonTitle, 
  IonToggle,
  IonToolbar 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  settingsOutline,
  cogOutline,
  optionsOutline,
  constructOutline,
  moonOutline,
  colorPaletteOutline,
  languageOutline,
  chevronForwardOutline,
  notificationsOutline,
  phonePortraitOutline,
  mailOutline,
  personOutline,
  personCircleOutline,
  shieldOutline,
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
    IonButton,
    IonButtons,
    IonContent,
    IonHeader, 
    IonIcon, 
    IonMenuButton, 
    IonTitle, 
    IonToggle,
    IonToolbar
  ]
})
export class SettingsPage implements OnInit {
  paletteToggle = false;

  constructor() {
    addIcons({
      settingsOutline,
      cogOutline,
      optionsOutline,
      constructOutline,
      moonOutline,
      colorPaletteOutline,
      languageOutline,
      chevronForwardOutline,
      notificationsOutline,
      phonePortraitOutline,
      mailOutline,
      personOutline,
      personCircleOutline,
      shieldOutline,
      informationCircleOutline,
      codeOutline,
      helpCircleOutline,
      saveOutline
    });
  }

  ngOnInit() {
    // Check if user has a saved preference
    const saved = localStorage.getItem('saf-dark-mode');
    if (saved !== null) {
      this.paletteToggle = saved === 'true';
      this.toggleDarkPalette(this.paletteToggle);
    } else {
      // Use matchMedia to check the user preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.paletteToggle = prefersDark.matches;
      this.toggleDarkPalette(this.paletteToggle);
      // Listen for changes to the prefers-color-scheme media query only if no user preference
      prefersDark.addEventListener('change', (mediaQuery) => {
        if (localStorage.getItem('saf-dark-mode') === null) {
          this.paletteToggle = mediaQuery.matches;
          this.toggleDarkPalette(this.paletteToggle);
        }
      });
    }
  }

  // Listen for the toggle check/uncheck to toggle the dark palette
  toggleChange(event: CustomEvent) {
    this.paletteToggle = event.detail.checked;
    this.toggleDarkPalette(this.paletteToggle);
    localStorage.setItem('saf-dark-mode', String(this.paletteToggle));
  }

  // Add or remove the "ion-palette-dark" class on the html element
  toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }
}
