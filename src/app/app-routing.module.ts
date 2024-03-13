import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/routes/home/home.component';
import { CardSelectionComponent } from './components/routes/card-selection/card-selection.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
 /*  {path: 'cardSelection', component: CardSelectionComponent}, */
 { 
  path: 'cardSelection', 
  component: CardSelectionComponent, 
  canActivate: [AuthGuard] 
},
{ path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
