import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart/chart.component';
import { ZingchartAngularModule } from 'zingchart-angular';



@NgModule({
  declarations: [
    ChartComponent,
  ],
  imports: [
    CommonModule,
    ZingchartAngularModule 
  ],
/*   schemas: [ NO_ERRORS_SCHEMA ], */
  exports:[
    ChartComponent
    ]
})
export class SharedModule { }
