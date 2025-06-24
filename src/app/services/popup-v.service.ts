import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupVService {

   mostrar: boolean = false;
 
   actualizarMostrar(valor: boolean) {
     this.mostrar = valor;
     /* console.log("valor: ", valor) */
   }
 
}
