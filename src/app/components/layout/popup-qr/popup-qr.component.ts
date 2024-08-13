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

  gratis:boolean=false;

  constructor(private popupService: PopupQrService) { 
    this.subscriptions.add(this.popupService.data$.subscribe(data => {
      this.data = data;
      this.qrdata = this.data;
    }));

    this.subscriptions.add(this.popupService.gratis$.subscribe(data => {
      this.gratis = data;
    }));
    
  }
  

  onBackgroundTouched() {
    this.popupService.actualizarMostrar(false)
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
