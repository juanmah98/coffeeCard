import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupQrComponent } from './popup-qr/popup-qr.component';



@NgModule({
  declarations: [
    PopupQrComponent
  ],
  
  exports: [
    PopupQrComponent
  ],
  
  imports: [
    CommonModule
  ]
  
})
export class LayoutModule { }
