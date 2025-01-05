import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoutesModule } from './components/routes/routes.module';
import { QRCodeModule } from 'angularx-qrcode';
import { LayoutModule } from './components/layout/layout.module';
import { FormsModule } from '@angular/forms';
import { SplineViewerComponent } from './components/routes/spline-viewer/spline-viewer.component';
import { SplineViewrCardComponent } from './components/routes/spline-viewr-card/spline-viewr-card.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// Registrar el locale español
registerLocaleData(localeEs);
@NgModule({
  declarations: [
    AppComponent,
    SplineViewerComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    RoutesModule,
    LayoutModule,
    CommonModule,
    QRCodeModule,
    FormsModule,
      
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
