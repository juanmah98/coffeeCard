import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { PopupQrService } from 'src/app/services/popup-qr.service';

@Component({
  selector: 'app-popup-qr',
  templateUrl: './popup-qr.component.html',
  styleUrls: ['./popup-qr.component.scss']
})
export class PopupQrComponent{
  private subscriptions = new Subscription();
  data: string | null = null;
  qrdata:any='';

  constructor(private popupService: PopupQrService) { 
    this.subscriptions.add(this.popupService.data$.subscribe(data => {
      this.data = data;
      this.qrdata = this.data;
    }));
  }
  description = "Sexta edición de la Villa. Donde por primera vez repetimos destino, fue la casa seleccionada para 2021, la segunda de España. En esta ocasión confiamos despertanos de nuevo con churros para todos y resaca para nadie. Ubicada en Finestrat, cerca de Benidorm una capacidad de 20 camas aseguradas, zona de barbacoa al lado de la piscina, aislada de los vecinos, además de varias neveras industriales y cocina grande. La casa está a 10 minutos en coche del supermercado más cercano, lo que nos permite reponer cualquier cosa en cuanto falte, además de tener fácil acceso y espacio para aparcar."

  onBackgroundTouched() {
    this.popupService.actualizarMostrar(false)
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
