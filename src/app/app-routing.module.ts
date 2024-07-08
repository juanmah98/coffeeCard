import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/routes/home/home.component';
import { CardSelectionComponent } from './components/routes/card-selection/card-selection.component';
import { AuthGuard } from './auth.guard';
import { LectorQrComponent } from './components/routes/lector-qr/lector-qr.component';
import { PrincipalComponent } from './components/routes/principal/principal.component';
import { MenuComponent } from './components/routes/menu/menu.component';
import { MenuAdminComponent } from './components/routes/menu-admin/menu-admin.component';
import { SplineViewerComponent } from './components/routes/spline-viewer/spline-viewer.component';
import { EntidadAdminComponent } from './components/routes/entidad-admin/entidad-admin.component';
import { PrivacyPolicyComponent } from './components/layout/privacy-policy/privacy-policy.component';
import { CookiesPolicyComponent } from './components/layout/cookies-policy/cookies-policy.component';
import { LandingComponent } from './components/routes/landing/landing.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirigir a '/home' en la ruta raíz
  { path: 'home', component: HomeComponent },
  { path: 'view', component: SplineViewerComponent },
  { path: 'principal', component: PrincipalComponent, canActivate: [AuthGuard] },
  { path: 'qrscan', component: LectorQrComponent, canActivate: [AuthGuard]},
  { path: 'cardSelection', component: CardSelectionComponent, canActivate: [AuthGuard] },
  { path: 'menu', component: MenuComponent },
  { path: 'menu-admin', component: MenuAdminComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: EntidadAdminComponent, canActivate: [AuthGuard]  },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'cookies-policy', component: CookiesPolicyComponent },
  { path: 'landing', component: LandingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
