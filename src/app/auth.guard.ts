import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../app/services/auth.service.service'; // Importar el servicio de autenticación

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {} // Inyectar AuthService

  canActivate(): boolean {
    const loggedIn = this.authService.isLoggedIn; // Obtener el estado de autenticación desde AuthService
    if (!loggedIn) {
      this.router.navigate(['/home']); // Redirigir a la página de inicio si no está autenticado
      return false;
    }
    return true;
  }
}
