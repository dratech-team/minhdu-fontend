import {CommonModule, DecimalPipe} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar';
import {RouterModule} from '@angular/router';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {ContextMenuModule} from 'ngx-contextmenu';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {PieChartComponent} from './chart/pie-chart/pie-chart-component';
import {StakedVerticalChartComponent} from './chart/staked-vertical-bar-chart/staked-vertical-chart.component';
import {SwimLaneChartComponent} from './chart/swimlane-chart/swim-lane-chart.component';
import {DevelopmentComponent} from './development/development.component';
import {DialogDatePickerComponent} from './dialog-datepicker/dialog-datepicker.component';
import {DialogDeleteComponent} from './dialog-delete/dialog-delete.component';
import {DialogExportComponent} from './dialog-export/dialog-export.component';
import {DialogSharedComponent} from './dialog-shared/dialog-shared.component';
import {InputCurrencyDirective} from './directive/input-currency.directive';
import {MouseRightChipPositionComponent} from './mouse-right-position-of-branch/mouse-right-chip-position.component';
import {MouseRightComponent} from './mouse-right/mouse-right.component';
import {PickLocationComponent} from './pick-location/pick-location.component';
import {NotEmptyPipe} from './pipes/notEmty.pipe';
import {SearchEmployeePipe} from './pipes/searchEmployee.pipe';
import {TransformUnitPipe} from './pipes/transform-unit.pipe';
import {TransformPipe} from './pipes/transform.pipe';
import {ShowAlertComponent} from './show-alert/show-alert.component';
import {SnackBarComponent} from './snackBar/snack-bar.component';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {NzInputModule} from 'ng-zorro-antd/input';
import {FilterDayPipe} from './pipes/filter-day.pipe';
import {PickEmployeeComponent} from './pick-employee/pick-employee.component';
import {TableEmployeeSelectedComponent} from './table-employee-selected/table-employee-selected.component';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatRadioModule} from '@angular/material/radio';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {NzPopoverModule} from 'ng-zorro-antd/popover';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzCollapseModule} from 'ng-zorro-antd/collapse';
import {NzTypographyModule} from 'ng-zorro-antd/typography';
import {NzWaveModule} from 'ng-zorro-antd/core/wave';
import {CollapseDatepickerComponent} from './collapse-datepicker/collapse-datepicker.component';
import {TitleDatepickerComponent} from './title-datepicker/title-datepicker.component';
import {RagePickerComponent} from './range-datepicker/range-datepicker.component';
import {NzRadioModule} from "ng-zorro-antd/radio";
import {CollapseRadioComponent} from './collapse-radio/collapse-radio.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {CollapseSelectComponent} from "./collapse-select/collapse-select.component";
import {ModalAlertComponent} from "./modal-alert/modal-alert.component";
import {ModalDatePickerComponent} from "./modal-date-picker/modal-date-picker.component";
import {TransformNzDateModePipe} from "./pipes/transform-nz-date-mode.pipe";

@NgModule({
    imports: [
        MatSnackBarModule,
        CommonModule,
        RouterModule,
        MatMenuModule,
        ContextMenuModule.forRoot({useBootstrap4: true, autoFocus: true}),
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
        NgxSkeletonLoaderModule,
        NzSelectModule,
        NzPopoverModule,
        NzInputModule,
        NzCollapseModule,
        MatExpansionModule,
        MatRadioModule,
        NzDatePickerModule,
        NzPopoverModule,
        NzCollapseModule,
        NzTypographyModule,
        NzWaveModule,
        NzButtonModule,
        NzRadioModule,
        MatProgressSpinnerModule,
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
    DialogDatePickerComponent,
    FilterDayPipe,
    PickEmployeeComponent,
    TableEmployeeSelectedComponent,
    TitleDatepickerComponent,
    CollapseDatepickerComponent,
    RagePickerComponent,
    CollapseRadioComponent,
    CollapseSelectComponent,
    ModalDatePickerComponent,
    TransformNzDateModePipe,
    ModalAlertComponent,
  ],
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
    DialogDatePickerComponent,
    FilterDayPipe,
    PickEmployeeComponent,
    TableEmployeeSelectedComponent,
    TitleDatepickerComponent,
    CollapseDatepickerComponent,
    CollapseRadioComponent,
    CollapseSelectComponent,
    ModalDatePickerComponent,
    TransformNzDateModePipe,
    ModalAlertComponent,
  ],
  providers: [
    DecimalPipe,
    MatDatepickerModule,
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
  ]
})
export class ComponentsModule {
}
