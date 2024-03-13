// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean = false;

  constructor() { }

  login() {
    // Lógica de inicio de sesión
    this.isLoggedIn = true;
  }

  logout() {
    // Lógica de cierre de sesión
    this.isLoggedIn = false;
  }
}
