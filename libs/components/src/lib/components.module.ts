import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
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
import { DialogDatePickerComponent } from './dialog-datepicker/dialog-datepicker.component';
import { DialogDeleteComponent } from './dialog-delete/dialog-delete.component';
import { DialogExportComponent } from './dialog-export/dialog-export.component';
import { DialogSharedComponent } from './dialog-shared/dialog-shared.component';
import { InputCurrencyDirective } from './directive/input-currency.directive';
import { MouseRightChipPositionComponent } from './mouse-right-position-of-branch/mouse-right-chip-position.component';
import { MouseRightComponent } from './mouse-right/mouse-right.component';
import { PickLocationComponent } from './pick-location/pick-location.component';
import { NotEmptyPipe } from './pipes/notEmty.pipe';
import { SearchEmployeePipe } from './pipes/searchEmployee.pipe';
import { TransformUnitPipe } from './pipes/transform-unit.pipe';
import { TransformPipe } from './pipes/transform.pipe';
import { ShowAlertComponent } from './show-alert/show-alert.component';
import { SnackBarComponent } from './snackBar/snack-bar.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

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
    MatAutocompleteModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [
    SwimLaneChartComponent,
    SnackBarComponent,
    DevelopmentComponent,
    MouseRightComponent,
    SearchEmployeePipe,
    DialogDeleteComponent,
    NotEmptyPipe,
    InputCurrencyDirective,
    PieChartComponent,
    StakedVerticalChartComponent,
    PickLocationComponent,
    ShowAlertComponent,
    TransformUnitPipe,
    TransformPipe,
    DialogSharedComponent,
    MouseRightChipPositionComponent,
    DialogExportComponent,
    DialogDatePickerComponent
  ],
  providers: [DecimalPipe, MatDatepickerModule],
  exports: [
    SwimLaneChartComponent,
    SnackBarComponent,
    DevelopmentComponent,
    MouseRightComponent,
    DialogDeleteComponent,
    NotEmptyPipe,
    SearchEmployeePipe,
    InputCurrencyDirective,
    PieChartComponent,
    StakedVerticalChartComponent,
    PickLocationComponent,
    ShowAlertComponent,
    TransformUnitPipe,
    TransformPipe,
    DialogSharedComponent,
    MouseRightChipPositionComponent,
    DialogExportComponent,
    DialogDatePickerComponent
  ],
})
export class ComponentsModule {}
