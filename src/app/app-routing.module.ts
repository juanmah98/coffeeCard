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
import { EmployeeSalaryComponent } from './components/routes/employee-salary/employee-salary.component';
import { RegistroEmpresasComponent } from './components/routes/registro-empresas/registro-empresas.component';
import { PanelMasterComponent } from './components/routes/panel-master/panel-master.component';
import { ActivateComponent } from './components/routes/activate/activate.component';
import { GeneradorQrsComponent } from './components/routes/generador-qrs/generador-qrs.component';
import { LectorQrUsuarioComponent } from './components/routes/lector-qr-usuario/lector-qr-usuario.component';
import { ChartComponent } from './components/shared/chart/chart.component';

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
  { path: 'master', component: PanelMasterComponent, canActivate: [AuthGuard]  },
  { path: 'pagos', component: EmployeeSalaryComponent },
  { path: 'registro', component: RegistroEmpresasComponent },
  { path: 'activate', component: ActivateComponent },
  { path: 'qrsgenerate', component: GeneradorQrsComponent, canActivate: [AuthGuard] },
  { path: 'qrscanuser', component: LectorQrUsuarioComponent, canActivate: [AuthGuard] },
  { path: 'chart', component: ChartComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
