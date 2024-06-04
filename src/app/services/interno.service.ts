import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuarios } from '../interfaces/usuarios';
import { Entidades } from '../interfaces/entdidades';

@Injectable({
  providedIn: 'root'
})
export class InternoService {

  private logged = new BehaviorSubject<boolean>(false);
  private user = new BehaviorSubject<Usuarios>(
    {
      "id": "",
      "email": "",
      "contador_cafe_id": "",
      "admin": false,
      "name":"",
      "entidad_id":""
    }
  );
  
  private entidad = new BehaviorSubject<Entidades>({
  
      "id": "",
      "nombre": "",
      "email": "",
      "background": "0",
      "fecha_creacion": new Date(),
  });

  miControl$ = this.logged.asObservable();
  miUser$ = this.user.asObservable();
  miEntidad$ = this.entidad.asObservable();

  constructor() {
    // Recuperar datos del localStorage al iniciar el servicio
    const userString = localStorage.getItem('user');
    const loggedString = localStorage.getItem('logged');
    const entidadString = localStorage.getItem('entidad');

    if (userString) {
      const user = JSON.parse(userString);
      this.user.next(user);
    }

    if (loggedString) {
      const logged = JSON.parse(loggedString);
      this.logged.next(logged);
    }

    /* if (entidadString) {
      const entidad = JSON.parse(entidadString);
      this.entidad.next(entidad);
    } */
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

  getEntidad(): Entidades {
    return this.entidad.value;
  }

  setEntidad(valor: Entidades): void {
    this.entidad.next(valor);
    localStorage.setItem('entidad', JSON.stringify(valor));
  }
}
