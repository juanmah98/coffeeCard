import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../app/services/auth.service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/inicio']); // Cambiar a la ruta de inicio de sesión
      return false;
    }
  }
}
