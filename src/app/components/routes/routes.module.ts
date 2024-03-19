import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { CardSelectionComponent } from './card-selection/card-selection.component';
import { QRCodeModule } from 'angularx-qrcode';



@NgModule({
  declarations: [
    HomeComponent,
    CardSelectionComponent
  ],
  imports: [
    CommonModule,
    QRCodeModule
  ],
  exports:[
    HomeComponent,
    CardSelectionComponent
  ],
})
export class RoutesModule { }
