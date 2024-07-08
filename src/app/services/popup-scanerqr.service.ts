import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CafeData } from '../interfaces/cafes_data';

@Injectable({
  providedIn: 'root'
})
export class PopupScanerqrService {

  private dataSubject = new BehaviorSubject<string | null>('null'); // Aquí guardamos el string
  private dataSubjectContador= new BehaviorSubject<CafeData>({
    id: "",
    usuario_id: '',
    contador: 0,
    gratis: false,
    opcion: 0,
    cantidad_gratis: 0
  }); // Aquí guardamos el string
  data$ = this.dataSubject.asObservable();
  dataContador$ = this.dataSubjectContador.asObservable();
  mostrar: boolean = false;

  actualizarMostrar(valor: boolean) {
    this.mostrar = valor;
    console.log("valor: ", valor)
  }

  setData(data: string): void {
    this.dataSubject.next(data);
  }
  setDataContador(data: CafeData): void {
    this.dataSubjectContador.next(data);
  }
}
