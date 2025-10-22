import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { IonContent, IonIcon, IonToggle, IonButton, IonRange } from '@ionic/angular/standalone';

interface SettingsConfig {
  pushNotifications: boolean;
  emailNotifications: boolean;
  overdueInvoiceNotifications: boolean;
  systemNotifications: boolean;
  alertSound: boolean;
  notificationVolume: number;
  interfaceSounds: boolean;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    HeaderComponent,
    IonContent, 
    IonIcon, 
    IonToggle, 
    IonButton, 
    IonRange
  ]
})
export class SettingsPage implements OnInit {
  paletteToggle = false;

  settings: SettingsConfig = {
    pushNotifications: true,
    emailNotifications: true,
    overdueInvoiceNotifications: true,
    systemNotifications: false,
    alertSound: true,
    notificationVolume: 70,
    interfaceSounds: true
  };

  lastSaved: Date | null = null;
  private audioContext: AudioContext | null = null;

  constructor() {
    // Los iconos ahora se registran en IconsComponent
  }

  ngOnInit() {
    this.loadSettings();
  }

  onSettingChange(setting: keyof SettingsConfig, event: any) {
    (this.settings as any)[setting] = event.detail.checked;
    this.saveSettings();
  }

  onVolumeChange(event: any) {
    this.settings.notificationVolume = event.detail.value;
    this.saveSettings();
  }

  async testAlertSound() {
    if (!this.settings.alertSound) return;

    try {
      // Crear un nuevo audio
      const audio = new Audio('/assets/beep.mp3');
      audio.volume = this.settings.notificationVolume / 100;
      
      // Reproducir el sonido
      await audio.play();
    } catch (error) {
      console.error('Error al reproducir el sonido de alerta:', error);
      
      // Fallback: crear un beep sintético
      this.createSyntheticBeep();
    }
  }

  private createSyntheticBeep() {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.settings.notificationVolume / 100, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
    } catch (error) {
      console.error('Error al crear beep sintético:', error);
    }
  }

  saveSettings() {
    try {
      localStorage.setItem('saf-settings', JSON.stringify(this.settings));
      this.lastSaved = new Date();
      console.log('Configuraciones guardadas exitosamente');
    } catch (error) {
      console.error('Error al guardar configuraciones:', error);
    }
  }

  loadSettings() {
    try {
      const savedSettings = localStorage.getItem('saf-settings');
      if (savedSettings) {
        this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        this.lastSaved = new Date();
      }
    } catch (error) {
      console.error('Error al cargar configuraciones:', error);
    }
  }

  resetToDefaults() {
    this.settings = {
      pushNotifications: true,
      emailNotifications: true,
      overdueInvoiceNotifications: true,
      systemNotifications: false,
      alertSound: true,
      notificationVolume: 70,
      interfaceSounds: true
    };
    this.saveSettings();
  }
}