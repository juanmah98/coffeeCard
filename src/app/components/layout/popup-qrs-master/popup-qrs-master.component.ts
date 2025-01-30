import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PopupQrsMasterService } from 'src/app/services/popup-qrs-master.service';

@Component({
  selector: 'app-popup-qrs-master',
  templateUrl: './popup-qrs-master.component.html',
  styleUrls: ['./popup-qrs-master.component.scss']
})
export class PopupQrsMasterComponent{
private subscriptions = new Subscription();
data: string[] | null = null;
hoy: Date = new Date()

  constructor(private popupService: PopupQrsMasterService) {
    this.subscriptions.add(this.popupService.data$.subscribe(data => {
      this.data = data;
    }));
   }

  onBackgroundTouched() {
    this.popupService.actualizarMostrar(false);
  }
}
