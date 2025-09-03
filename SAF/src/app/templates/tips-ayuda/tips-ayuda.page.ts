import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonImg } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tips-ayuda',
  templateUrl: './tips-ayuda.page.html',
  styleUrls: ['./tips-ayuda.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonImg]
})
export class TipsAyudaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
