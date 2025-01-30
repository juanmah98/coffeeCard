import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupQrsMasterService {
  private dataSubject = new BehaviorSubject<string[] | null>([]); // Aquí guardamos el string
  data$ = this.dataSubject.asObservable();
  mostrar: boolean = false;
 
  actualizarMostrar(valor: boolean) {
    this.mostrar = valor;
  }

  setData(data: string[]): void {
    this.dataSubject.next(data);
  }
}
