import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupQrComponent } from './popup-qr/popup-qr.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ToastComponent } from './toast/toast.component';



@NgModule({
  declarations: [
    PopupQrComponent,
    ToastComponent
  ],
  
  exports: [
    PopupQrComponent,
    ToastComponent
  ],
  
  imports: [
    CommonModule,
    QRCodeModule
  ]
  
})
export class LayoutModule { }
