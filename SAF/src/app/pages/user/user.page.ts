import { Component, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonButton, IonInput, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    IonButton,
    IonInput,
    IonSelect,
    IonSelectOption,
    FormsModule,
    HeaderComponent
]
})
export class UserPage {

  // Estado del modal de editar perfil
  isEditProfileOpen = false;

  // Datos del usuario (mock data para el template)
  userData = {
    name: 'María García López',
    role: 'Analista Financiero Senior',
    department: 'Departamento de Contabilidad',
    email: 'maria.garcia@empresa.com',
    phone: '+52 (55) 1234-5678',
    joinDate: '15 de Marzo, 2022',
    employeeId: 'EMP-2022-0347',
    stats: {
      processed: 127,
      approved: 98,
      pending: 15,
      rejected: 14
    }
  };

  router = inject(Router);

  // Métodos para el modal de editar perfil
  openEditProfileDrawer() {
    this.isEditProfileOpen = true;
  }

  closeEditProfileDrawer() {
    this.isEditProfileOpen = false;
  }

  // Métodos para funcionalidades futuras
  onSaveProfile() {
    console.log('Guardar perfil');
    this.closeEditProfileDrawer();
  }

  onChangeAvatar() {
    console.log('Cambiar avatar');
  }
}