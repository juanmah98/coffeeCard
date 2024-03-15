import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuarios } from '../interfaces/usuarios';

@Injectable({
  providedIn: 'root'
})
export class InternoService {

  constructor() { }

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

  getLogged(): boolean {
    return this.logged.value;
  }

  setLogged(valor: boolean): void {
    this.logged.next(valor);
  }

  getUser(): Usuarios {
    return this.user.value;
  }

  setUser(valor: Usuarios): void {
    this.user.next(valor);
  }
}
