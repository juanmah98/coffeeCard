import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuarios } from '../interfaces/usuarios';
import { Entidades } from '../interfaces/entdidades';
import { Usuarios_admins } from '../interfaces/usuarios_admin';

@Injectable({
  providedIn: 'root'
})
export class InternoService {

  private logged = new BehaviorSubject<boolean>(false);
  private user = new BehaviorSubject<Usuarios>(
    {
      "id": "",
      "email": "",
      "name":"",
      "fecha_creacion": new Date(),
      "pais": '',
      "waitlist": false
    }
  );
  
  private entidad = new BehaviorSubject<Entidades>({
  
      "id": "",
      "nombre": "",
      "email": "",
      "background": "0",
      "tabla_contador": "",
      "fecha_creacion": new Date(),
      "pais": '',
      "informacion":'',
      "text_card":''
  });

  private userAdmin = new BehaviorSubject<Usuarios_admins>({
  
    "id": "",
    "entidad_id": "",
    "nombre": "",
    "email": "",
    "soloLectura": false
});

private coockies = new BehaviorSubject<boolean>(true);
private onlyScaner = new BehaviorSubject<boolean>(false);

private userAll = new BehaviorSubject<Usuarios[]>([]);

  miControl$ = this.logged.asObservable();
  miUser$ = this.user.asObservable();
  miEntidad$ = this.entidad.asObservable();
  miUserAdmin$ = this.userAdmin.asObservable();
  miUserAll$ = this.userAll.asObservable();
  micoockies$ = this.coockies.asObservable();
  mionlyScaner$ = this.onlyScaner.asObservable();

  constructor() {
    // Recuperar datos del localStorage al iniciar el servicio
    const userString = localStorage.getItem('user');
    const loggedString = localStorage.getItem('logged');
    const entidadString = localStorage.getItem('entidad');
    const userADminString = localStorage.getItem('userAdmin');
    const coockiesString = localStorage.getItem('coockies');
    const onlyScanerString = localStorage.getItem('onlyScaner');

    if (userString) {
      const user = JSON.parse(userString);
      this.user.next(user);
    }

    if (loggedString) {
      const logged = JSON.parse(loggedString);
      this.logged.next(logged);
    }
    if (coockiesString) {
      const coockies = JSON.parse(coockiesString);
      this.coockies.next(coockies);
    }
    if (onlyScanerString) {
      const onlyScaner = JSON.parse(onlyScanerString);
      this.onlyScaner.next(onlyScaner);
    }
    if (userADminString) {
      const userAdmin = JSON.parse(userADminString);
      this.logged.next(userAdmin);
    }

     if (entidadString) {
      const entidad = JSON.parse(entidadString);
      this.entidad.next(entidad);
    } 
  }

  getLogged(): boolean {
    return this.logged.value;
  }

  setLogged(valor: boolean): void {
    this.logged.next(valor);
    localStorage.setItem('logged', JSON.stringify(valor));
  }

  getCoockes(): boolean {
    return this.coockies.value;
  }

  setCoockes(valor: boolean): void {
    this.coockies.next(valor);
    localStorage.setItem('coockies', JSON.stringify(valor));
  }

  getOnlyScaner(): boolean {
    return this.onlyScaner.value;
  }

  setOnlyScaner(valor: boolean): void {
    this.onlyScaner.next(valor);
    localStorage.setItem('onlyScaner', JSON.stringify(valor));
  }

  getUser(): Usuarios {
    return this.user.value;
  }

  setUser(valor: Usuarios): void {
    this.user.next(valor);
    localStorage.setItem('user', JSON.stringify(valor));
  }

  getUserAll(): Usuarios[] {
    return this.userAll.value;
  }

  setUserAll(valor: Usuarios[]): void {
    this.userAll.next(valor);
  }

  getUserAdmin(): Usuarios_admins {
    return this.userAdmin.value;
  }

  setUserAdmin(valor: Usuarios_admins): void {
    this.userAdmin.next(valor);
    localStorage.setItem('userAdmin', JSON.stringify(valor));
  }

  getEntidad(): Entidades {
    return this.entidad.value;
  }

  setEntidad(valor: Entidades): void {
    this.entidad.next(valor);
    localStorage.setItem('entidad', JSON.stringify(valor));
  }
}
