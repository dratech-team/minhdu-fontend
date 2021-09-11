import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ContextMenuModule } from 'ngx-contextmenu';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PieChartComponent } from './chart/pie-chart/pie-chart-component';
import { StakedVerticalChartComponent } from './chart/staked-vertical-bar-chart/staked-vertical-chart.component';
import { SwimLaneChartComponent } from './chart/swimlane-chart/swim-lane-chart.component';
import { DevelopmentComponent } from './development/development.component';
import { DialogDeleteComponent } from './dialog-delete/dialog-delete.component';
import { InputCurrencyDirective } from './directive/input-currency.directive';
import { MouseRightComponent } from './mouse-right/mouse-right.component';
import { PickEmployeeComponent } from './pick-employee/pick-employee.component';
import { PickEmployeeService } from './pick-employee/pick-employee.service';
import { PickLocationComponent } from './pick-location/pick-location.component';
import { NotEmptyPipe } from './pipes/notEmty.pipe';
import { SearchEmployeePipe } from './pipes/searchEmployee.pipe';
import { SnackBarSuccessComponent } from './snackBar-success/snack-bar-success.component';

@NgModule({
  imports: [
    MatSnackBarModule,
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
    MatSelectModule,
  ],
  declarations: [
    SwimLaneChartComponent,
    SnackBarSuccessComponent,
    DevelopmentComponent,
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
  providers: [DecimalPipe, PickEmployeeService],
  exports: [
    SwimLaneChartComponent,
    SnackBarSuccessComponent,
    DevelopmentComponent,
    MouseRightComponent,
    DialogDeleteComponent,
    NotEmptyPipe,
    SearchEmployeePipe,
    InputCurrencyDirective,
    PickEmployeeComponent,
    PieChartComponent,
    StakedVerticalChartComponent,
    PickLocationComponent,
  ],
})
export class ComponentsModule {}
