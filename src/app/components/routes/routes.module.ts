import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { CardSelectionComponent } from './card-selection/card-selection.component';
import { QRCodeModule } from 'angularx-qrcode';
import { LectorQrComponent } from './lector-qr/lector-qr.component';
import { PrincipalComponent } from './principal/principal.component';
import { PopupQrComponent } from '../layout/popup-qr/popup-qr.component';
import { LayoutModule } from '../layout/layout.module';
import { MenuComponent } from './menu/menu.component';
import { MenuAdminComponent } from './menu-admin/menu-admin.component';
import { FormsModule } from '@angular/forms';
import { SplineViewerComponent } from './spline-viewer/spline-viewer.component';
import { SplineViewrCardComponent } from './spline-viewr-card/spline-viewr-card.component';



@NgModule({
  declarations: [
    HomeComponent,
    CardSelectionComponent,
    LectorQrComponent,
    PrincipalComponent,
    MenuComponent,
    MenuAdminComponent,
    SplineViewrCardComponent
   
    
  ],
  imports: [
    CommonModule,
    QRCodeModule,
    LayoutModule,
    FormsModule
  ],
  exports:[
    HomeComponent,
    CardSelectionComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  
})
export class RoutesModule { }
