import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getAuth, signInWithEmailAndPassword, signOut, User, onAuthStateChanged } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class Firedb {
  private auth = getAuth();
  private currentUser: User | null = null;
  private authState$!: Observable<User | null>;

  constructor() {
    // Crear un Observable a partir de onAuthStateChanged del SDK modular
    this.authState$ = new Observable<User | null>((subscriber) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        this.currentUser = user;
        subscriber.next(user);
      }, (error) => subscriber.error(error));
      return unsubscribe;
    });
  }

  /**
   * Inicia sesión con email y contraseña
   * @param email Email del usuario
   * @param password Contraseña del usuario
   * @returns Promise con el resultado de la autenticación
   */
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.currentUser = userCredential.user;
      return userCredential.user;
    } catch (error: any) {
      console.error('Error en login:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Cierra la sesión del usuario actual
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.currentUser = null;
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  }

  /**
   * Obtiene el usuario actualmente autenticado
   * @returns Usuario actual o null si no hay sesión
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Verifica si hay un usuario autenticado
   * @returns true si hay sesión activa
   */
  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  /**
   * Observable del estado de autenticación
   * @returns Observable que emite cuando cambia el estado de autenticación
   */
  getAuthState(): Observable<User | null> {
    return this.authState$;
  }

  /**
   * Maneja los errores de Firebase Auth y retorna mensajes amigables
   */
  private handleAuthError(error: any): Error {
    let message = 'Error en la autenticación';
    
    switch (error.code) {
      case 'auth/invalid-email':
        message = 'El correo electrónico no es válido';
        break;
      case 'auth/user-disabled':
        message = 'Esta cuenta ha sido deshabilitada';
        break;
      case 'auth/user-not-found':
        message = 'No existe una cuenta con este correo';
        break;
      case 'auth/wrong-password':
        message = 'Contraseña incorrecta';
        break;
      case 'auth/invalid-credential':
        message = 'Credenciales inválidas. Verifica tu correo y contraseña';
        break;
      case 'auth/too-many-requests':
        message = 'Demasiados intentos fallidos. Intenta más tarde';
        break;
      case 'auth/network-request-failed':
        message = 'Error de conexión. Verifica tu internet';
        break;
      default:
        message = error.message || 'Error desconocido en la autenticación';
    }
    
    return new Error(message);
  }
}
