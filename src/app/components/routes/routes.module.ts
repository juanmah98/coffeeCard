import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { CardSelectionComponent } from './card-selection/card-selection.component';



@NgModule({
  declarations: [
    HomeComponent,
    CardSelectionComponent
  ],
  imports: [
    CommonModule
  ]
})
export class RoutesModule { }
