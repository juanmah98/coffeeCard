import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { CardSelectionComponent } from './card-selection/card-selection.component';
import { QRCodeModule } from 'angularx-qrcode';
import { LectorQrComponent } from './lector-qr/lector-qr.component';
import { PrincipalComponent } from './principal/principal.component';
import { PopupQrComponent } from '../layout/popup-qr/popup-qr.component';
import { LayoutModule } from '../layout/layout.module';



@NgModule({
  declarations: [
    HomeComponent,
    CardSelectionComponent,
    LectorQrComponent,
    PrincipalComponent,
   
    
  ],
  imports: [
    CommonModule,
    QRCodeModule,
    LayoutModule
  ],
  exports:[
    HomeComponent,
    CardSelectionComponent
  ],
})
export class RoutesModule { }
