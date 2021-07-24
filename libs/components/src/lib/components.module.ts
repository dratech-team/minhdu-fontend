import { CommonModule,DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MouseRightComponent } from './mouse-right/mouse-right.component';
import { MatMenuModule } from '@angular/material/menu';
import { ContextMenuModule } from 'ngx-contextmenu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { SearchEmployeePipe } from './pipes/searchEmployee.pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DialogDeleteComponent } from './dialog-delete/dialog-delete.component';
import { NotEmptyPipe } from './pipes/notEmty.pipe';
import { InputCurrencyDirective } from './directive/input-currency.directive';
import { PickEmployeeComponent } from './pick-employee/pick-employee.component';
import { PickEmployeeService } from './pick-employee/pick-employee.service';
import { VerticalBarChartComponent } from './chart/vertical-bar-chart/vertical-bar-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PieChartComponent } from './chart/pie-chart/pie-chart-component';
import { StakedVerticalChartComponent } from './chart/staked-vertical-bar-chart/staked-vertical-chart.component';
import { PickLocationComponent } from './pick-location/pick-location.component';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    ContextMenuModule.forRoot({ useBootstrap4: true, autoFocus: true }),
    FormsModule,
    MatCheckboxModule,
    MatDialogModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    NgxChartsModule,
    MatSelectModule
  ],
  declarations: [
    VerticalBarChartComponent,
    MouseRightComponent,
    SearchEmployeePipe,
    DialogDeleteComponent,
    NotEmptyPipe,
    InputCurrencyDirective,
    PickEmployeeComponent,
    PieChartComponent,
    StakedVerticalChartComponent,
    PickLocationComponent,
  ],
  providers:[
    DecimalPipe,
    PickEmployeeService,
  ],
  exports: [
    VerticalBarChartComponent,
    MouseRightComponent,
    DialogDeleteComponent,
    NotEmptyPipe,
    SearchEmployeePipe,
    InputCurrencyDirective,
    PickEmployeeComponent,
    PieChartComponent,
    StakedVerticalChartComponent,
    PickLocationComponent
  ],
})
export class ComponentsModule {}
