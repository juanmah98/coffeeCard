import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupQrService {

  private dataSubject = new BehaviorSubject<string | null>('null'); // Aquí guardamos el string
  data$ = this.dataSubject.asObservable();
  mostrar: boolean = false;

  private gratis = new BehaviorSubject<boolean>(false);
  gratis$ = this.gratis.asObservable();

  
 /*  gratis:boolean=false; */

  actualizarMostrar(valor: boolean) {
    this.mostrar = valor;
    console.log("valor: ", valor)
  }

 /*  actualizarGratis(valor: boolean) {
    this.gratis = valor;
    console.log("valor: ", valor)
  } */

  getGratis(): boolean {
    return this.gratis.value;
  }

  setGratis(valor: boolean): void {
    this.gratis.next(valor);
    localStorage.setItem('gratis', JSON.stringify(valor));
  }

  setData(data: string): void {
    this.dataSubject.next(data);
  }
}
