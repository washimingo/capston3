import { Component, inject } from '@angular/core';
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

interface LoginError {
  message: string;
  code?: string;
}

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
    const validation = this.validateForm();
    if (!validation.isValid) {
      this.errorMessage = validation.message;
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      await this.firedb.login(this.email.trim().toLowerCase(), this.password);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      this.handleLoginError(error as LoginError);
    } finally {
      this.loading = false;
    }
  }

  private validateForm(): { isValid: boolean; message: string } {
    if (!this.email?.trim()) {
      return { isValid: false, message: 'El correo electrónico es obligatorio' };
    }
    
    if (!this.isValidEmail(this.email.trim())) {
      return { isValid: false, message: 'Ingresa un correo electrónico válido' };
    }
    
    if (!this.password?.trim()) {
      return { isValid: false, message: 'La contraseña es obligatoria' };
    }
    
    if (this.password.trim().length < 6) {
      return { isValid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }

    return { isValid: true, message: '' };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private handleLoginError(error: LoginError): void {
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        this.errorMessage = 'Credenciales incorrectas';
        break;
      case 'auth/too-many-requests':
        this.errorMessage = 'Demasiados intentos. Intenta más tarde';
        break;
      case 'auth/network-request-failed':
        this.errorMessage = 'Error de conexión. Verifica tu internet';
        break;
      default:
        this.errorMessage = error.message || 'Error al iniciar sesión';
    }
  }
}
