import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent, 
  IonInput, 
  IonButton, 
  IonSpinner,
  IonText
} from '@ionic/angular/standalone';
import { Firedb } from '../../services/Firebase/firedb';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.page.html',
  styleUrls: ['./authentication.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent, 
    IonInput, 
    IonButton, 
    IonSpinner,
    IonText,
    CommonModule, 
    FormsModule
  ]
})
export class AuthenticationPage {
  private firedb = inject(Firedb);
  private router = inject(Router);

  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  async onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor ingresa tu email y contraseña';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      await this.firedb.login(this.email, this.password);
      // Navegar al dashboard después del inicio de sesión exitoso
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Error al iniciar sesión';
    } finally {
      this.loading = false;
    }
  }
}
