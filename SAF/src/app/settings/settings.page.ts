import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonToggle, IonButtons, IonMenuButton } from '@ionic/angular/standalone';
// ...existing code...

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonLabel, IonToggle, IonButtons, IonMenuButton]
})
export class SettingsPage implements OnInit {
  darkMode = false;
  // ...existing code...

  constructor() { }

  ngOnInit() {
    const saved = localStorage.getItem('saf-dark-mode');
    this.darkMode = saved === 'true';
    this.setDarkMode(this.darkMode);
  }

  onToggleDarkMode(event: any) {
    this.darkMode = event.detail.checked;
    this.setDarkMode(this.darkMode);
    localStorage.setItem('saf-dark-mode', String(this.darkMode));
  }

  setDarkMode(enabled: boolean) {
    document.body.classList.toggle('dark', enabled);
  }

  // ...existing code...
}
