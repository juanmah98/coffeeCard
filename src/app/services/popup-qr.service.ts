import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupQrService {

  private dataSubject = new BehaviorSubject<string | null>(null); // Aquí guardamos el string
  data$ = this.dataSubject.asObservable();
  mostrar: boolean = false;

  actualizarMostrar(valor: boolean) {
    this.mostrar = valor;
    console.log("valor: ", valor)
  }

  setData(data: string): void {
    this.dataSubject.next(data);
  }
}
