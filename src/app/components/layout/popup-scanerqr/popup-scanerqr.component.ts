import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CafeData } from 'src/app/interfaces/cafes_data';
import { PopupScanerqrService } from 'src/app/services/popup-scanerqr.service';

@Component({
  selector: 'app-popup-scanerqr',
  templateUrl: './popup-scanerqr.component.html',
  styleUrls: ['./popup-scanerqr.component.scss']
})
export class PopupScanerqrComponent{

  private subscriptions = new Subscription();
  data: CafeData = {
    id: "",
    usuario_id: '',
    contador: 0,
    gratis: false,
    opcion: 0,
    cantidad_gratis: 0
  };
  info_data!:CafeData;

  constructor(private popupService: PopupScanerqrService) { 
    this.subscriptions.add(this.popupService.dataContador$.subscribe(data => {
      this.data = data;
      this.info_data = this.data;
    }));
    console.log("data: ", this.info_data)
   /*  this.subscriptions.add(this.popupService.dataOpcion$.subscribe(dataOpcion => {
      this.opcion = dataOpcion;
      this.opcion_data = this.opcion;
    })); */
  }

  onBackgroundTouched() {
    this.popupService.actualizarMostrar(false)
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
