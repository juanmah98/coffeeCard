import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupInfoService {

  private dataSubject = new BehaviorSubject<string | null>('null'); // Aquí guardamos el string
  private dataSubjectOpcion = new BehaviorSubject<string | null>('null'); // Aquí guardamos el string
  data$ = this.dataSubject.asObservable();
  dataOpcion$ = this.dataSubjectOpcion.asObservable();
  mostrar: boolean = false;

  actualizarMostrar(valor: boolean) {
    this.mostrar = valor;
    /* console.log("valor: ", valor) */
  }

  setData(data: string): void {
    this.dataSubject.next(data);
  }
  setDataOpcion(data: string): void {
    this.dataSubjectOpcion.next(data);
  }
}
