import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PopupInfoService } from 'src/app/services/popup-info.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent{

  private subscriptions = new Subscription();
  data: string | null = null;
  info_data:any='';
  opcion:string | null = null;
  opcion_data:any='';

  constructor(private popupService: PopupInfoService) { 
    this.subscriptions.add(this.popupService.data$.subscribe(data => {
      this.data = data;
      this.info_data = this.data;
    }));
    this.subscriptions.add(this.popupService.dataOpcion$.subscribe(dataOpcion => {
      this.opcion = dataOpcion;
      this.opcion_data = this.opcion;
    }));
  }

  onBackgroundTouched() {
    this.popupService.actualizarMostrar(false)
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  formatText(text: string): string {
    // Reemplazar caracteres específicos con etiquetas <br>
    return text
    .replace(/•\s*(\w)/g, (match, p1) => `<br>• ${p1.toUpperCase()}`) // Agregar <br> y poner en mayúscula la primera letra después de •
      .replace(/\//g, '<br>') // Reemplazar / con <br>
      .replace(/-/g, '<br>-') // Agregar <br> antes de guiones
      .replace(/["“”](.*?)["“”]/g, '<strong>$1</strong>')// Aplica negrita al texto entre comillas
      
  }

}
