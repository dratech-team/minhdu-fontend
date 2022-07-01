import { NgModule } from '@angular/core';
import { ComponentsModule } from '@minhdu-fontend/components';
import { MatDialogModule } from '@angular/material/dialog';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FeatureName } from '@minhdu-fontend/constants';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { TemplateRoutingModule } from './template-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TemplateOvertimeEffect } from './+state/template-overtime/template-overtime.effect';
import { templateOvertimeReducer } from './+state/template-overtime/template-overtime.reducer';
import { EmployeeModule } from '../employee/employee.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TemplateSalaryComponent } from './component/template-salary/template-salary.component';
import { TemplateOvertimeComponent } from './container/overtime-template/template-overtime.component';
import { DialogTemplateOvertimeComponent } from './component/template-overtime/dialog-template-overtime.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HolidayComponent } from './container/holiday/holiday.component';
import { DialogHolidayComponent } from './component/dialog-holiday/dialog-holiday.component';
import { templateSalaryReducer } from './+state/teamlate-salary/template-salary.reducer';
import { TemplateSalaryEffect } from './+state/teamlate-salary/template-salary.effect';
import { SalaryComponent } from './container/salary/salary.component';
import { SystemModule } from '@minhdu-fontend/system';
import { TransformBlockSalaryPipe } from './pipes/transform-block-salary.pipe';
import { DetailHoliday } from './container/detail-holiday/detail-holiday';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NgxCurrencyModule } from 'ngx-currency';
import { UnitDatetimePipe } from './pipes/unit-datetime.pipe';

@NgModule({
  imports: [
    ComponentsModule,
    TemplateRoutingModule,
    ComponentsModule,
    MatDialogModule,
    StoreModule,
    MatDialogModule,
    EffectsModule,
    InfiniteScrollModule,
    StoreModule.forFeature(
      FeatureName.TEMPLATE_OVERTIME,
      templateOvertimeReducer
    ),
    StoreModule.forFeature(FeatureName.TEMPLATE_SALARY, templateSalaryReducer),
    EffectsModule.forFeature([TemplateOvertimeEffect, TemplateSalaryEffect]),
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTabsModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    EmployeeModule,
    FormsModule,
    NgxSkeletonLoaderModule.forRoot(),
    MatProgressBarModule,
    MatProgressSpinnerModule,
    SystemModule,
    NzMessageModule,
    NzSelectModule,
    NzRadioModule,
    NzInputModule,
    NzCheckboxModule,
    NzTypographyModule,
    NgxCurrencyModule,
  ],
  declarations: [
    TemplateOvertimeComponent,
    SalaryComponent,
    TemplateSalaryComponent,
    DialogTemplateOvertimeComponent,
    HolidayComponent,
    DialogHolidayComponent,
    TransformBlockSalaryPipe,
    UnitDatetimePipe,
    DetailHoliday,
  ],
})
export class TemplateModule {}
