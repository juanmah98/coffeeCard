import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/routes/home/home.component';
import { CardSelectionComponent } from './components/routes/card-selection/card-selection.component';
import { AuthGuard } from './auth.guard';
import { LectorQrComponent } from './components/routes/lector-qr/lector-qr.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirigir a '/home' en la ruta raíz
  { path: 'home', component: HomeComponent },
  { path: 'qrscan', component: LectorQrComponent, canActivate: [AuthGuard]},
  { path: 'cardSelection', component: CardSelectionComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
