import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean = false;
  userRole: 'admin' | 'usuario' | null = null;

  constructor() {
    // Recuperar del localStorage si ya estaba logueado
    const savedLogin = localStorage.getItem('isLoggedIn');
    const savedRole = localStorage.getItem('userRole');

    this.isLoggedIn = savedLogin === 'true';
    this.userRole = savedRole as 'admin' | 'usuario' | null;
  }

  login(role: 'admin' | 'usuario') {
    this.isLoggedIn = true;
    this.userRole = role;

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', role);
  }

  logout() {
    this.isLoggedIn = false;
    this.userRole = null;

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
  }
}
