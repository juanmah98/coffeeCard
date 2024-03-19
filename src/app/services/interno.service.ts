import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuarios } from '../interfaces/usuarios';

@Injectable({
  providedIn: 'root'
})
export class InternoService {

  private logged = new BehaviorSubject<boolean>(false);
  private user = new BehaviorSubject<Usuarios>(
    {
      "id": "",
      "email": "",
      "contador_cafe_id": ""
    }
  );

  miControl$ = this.logged.asObservable();
  miUser$ = this.user.asObservable();

  constructor() {
    // Recuperar datos del localStorage al iniciar el servicio
    const userString = localStorage.getItem('user');
    const loggedString = localStorage.getItem('logged');

    if (userString) {
      const user = JSON.parse(userString);
      this.user.next(user);
    }

    if (loggedString) {
      const logged = JSON.parse(loggedString);
      this.logged.next(logged);
    }
  }

  getLogged(): boolean {
    return this.logged.value;
  }

  setLogged(valor: boolean): void {
    this.logged.next(valor);
    localStorage.setItem('logged', JSON.stringify(valor));
  }

  getUser(): Usuarios {
    return this.user.value;
  }

  setUser(valor: Usuarios): void {
    this.user.next(valor);
    localStorage.setItem('user', JSON.stringify(valor));
  }
}
