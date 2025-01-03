import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupQrComponent } from './popup-qr/popup-qr.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ToastComponent } from './toast/toast.component';
import { InfoComponent } from './info/info.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CookiesPolicyComponent } from './cookies-policy/cookies-policy.component';
import { FooterComponent } from './footer/footer.component';
import { BannerPolicyComponent } from './banner-policy/banner-policy.component';
import { PopupScanerqrComponent } from './popup-scanerqr/popup-scanerqr.component';
import { HeaderComponent } from './header/header.component';



@NgModule({
  declarations: [
    PopupQrComponent,
    ToastComponent,
    InfoComponent,
    PrivacyPolicyComponent,
    CookiesPolicyComponent,
    FooterComponent,
    BannerPolicyComponent,
    PopupScanerqrComponent,
    HeaderComponent
  ],
  
  exports: [
    PopupQrComponent,
    ToastComponent,
    InfoComponent,
    BannerPolicyComponent,
    FooterComponent,
    PopupScanerqrComponent,
    HeaderComponent
  ],
  
  imports: [
    CommonModule,
    QRCodeModule
  ]
  
})
export class LayoutModule { }
