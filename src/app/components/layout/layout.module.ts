import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupQrComponent } from './popup-qr/popup-qr.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ToastComponent } from './toast/toast.component';
import { InfoComponent } from './info/info.component';



@NgModule({
  declarations: [
    PopupQrComponent,
    ToastComponent,
    InfoComponent
  ],
  
  exports: [
    PopupQrComponent,
    ToastComponent,
    InfoComponent
  ],
  
  imports: [
    CommonModule,
    QRCodeModule
  ]
  
})
export class LayoutModule { }
