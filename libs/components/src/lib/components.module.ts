import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
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
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PieChartComponent } from './chart/pie-chart/pie-chart-component';
import { StakedVerticalChartComponent } from './chart/staked-vertical-bar-chart/staked-vertical-chart.component';
import { SwimLaneChartComponent } from './chart/swimlane-chart/swim-lane-chart.component';
import { DevelopmentComponent } from './development/development.component';
import { DialogDatePickerComponent } from './dialog-datepicker/dialog-datepicker.component';
import { DialogDeleteComponent } from './dialog-delete/dialog-delete.component';
import { DialogExportComponent } from './dialog-export/dialog-export.component';
import { InputCurrencyDirective } from './directive/input-currency.directive';
import { MouseRightComponent } from './mouse-right/mouse-right.component';
import { NotEmptyPipe } from './pipes/notEmty.pipe';
import { SearchEmployeePipe } from './pipes/searchEmployee.pipe';
import { TransformUnitPipe } from './pipes/transform-unit.pipe';
import { TransformConstantPipe } from './pipes/transform-constant.pipe';
import { ShowAlertComponent } from './show-alert/show-alert.component';
import { SnackBarComponent } from './snackBar/snack-bar.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FilterDayPipe } from './pipes/filter-day.pipe';
import { PickEmployeeComponent } from './pick-employee/pick-employee.component';
import { TableEmployeeSelectedComponent } from './table-employee-selected/table-employee-selected.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { CollapseDatepickerComponent } from './collapse-datepicker/collapse-datepicker.component';
import { TitleDatepickerComponent } from './title-datepicker/title-datepicker.component';
import { RagePickerComponent } from './range-datepicker/range-datepicker.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { CollapseRadioComponent } from './collapse-radio/collapse-radio.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CollapseSelectComponent } from './collapse-select/collapse-select.component';
import { ModalAlertComponent } from './modal-alert/modal-alert.component';
import { ModalDatePickerComponent } from './modal-date-picker/modal-date-picker.component';
import { TransformNzDateModePipe } from './pipes/transform-nz-date-mode.pipe';
import { ModalNoteComponent } from './modal-note/modal-note.component';
import { TotalPricePipe } from './pipes/total-price.pipe';
import { RoundingNumberPipe } from './pipes/rounding-number.pipe';
import { ModalExportExcelComponent } from './modal-export/modal-export-excel.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ConvertMinutePipe } from './pipes/convert-minute.pipe';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { ChartService } from './chart/services/chart.service';
import { PlaceSelectorComponent } from './pick-location/place-selector.component';
import { DialogSharedComponent } from './dialog-shared';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { RichTextComponent } from './rich-text/rich-text.component';
import { NzFormModule } from 'ng-zorro-antd/form';

const NzModules = [
  NzSelectModule,
  NzPopoverModule,
  NzInputModule,
  NzCollapseModule,
  NzDatePickerModule,
  NzPopoverModule,
  NzCollapseModule,
  NzTypographyModule,
  NzWaveModule,
  NzButtonModule,
  NzRadioModule,
  NzTableModule,
  NzDropDownModule
];

const MatModules = [
  MatSnackBarModule,
  MatMenuModule,
  MatCheckboxModule,
  MatDialogModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatExpansionModule,
  MatRadioModule,
  MatProgressSpinnerModule
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    InfiniteScrollModule,
    NgxChartsModule,
    BsDatepickerModule.forRoot(),
    NgxSkeletonLoaderModule,
    NzModules,
    MatModules,
    TooltipModule,
    NzSkeletonModule,
    NzToolTipModule,
    NzFormModule
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
    PlaceSelectorComponent,
    ShowAlertComponent,
    TransformUnitPipe,
    TransformConstantPipe,
    DialogSharedComponent,
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
    ModalNoteComponent,
    TotalPricePipe,
    RoundingNumberPipe,
    ModalExportExcelComponent,
    ConvertMinutePipe,
    RichTextComponent
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
    PlaceSelectorComponent,
    ShowAlertComponent,
    TransformUnitPipe,
    TransformConstantPipe,
    DialogSharedComponent,
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
    ModalNoteComponent,
    TotalPricePipe,
    RoundingNumberPipe,
    ModalExportExcelComponent,
    ConvertMinutePipe,
    RichTextComponent
  ],
  providers: [
    ChartService,
    DatePipe,
    DecimalPipe,
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } }
  ]
})
export class ComponentsModule {
}
