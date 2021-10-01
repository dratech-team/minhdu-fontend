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
import { SalaryBasicComponent } from './container/salary-basic/salary-basic.component';
import { EmployeeModule } from '../employee/employee.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { TemplateSalaryBasicComponent } from './component/template-salary-basic/template-salary-basic.component';
import { TemplateOvertimeComponent } from './container/overtime-template/template-overtime.component';
import { DialogTemplateOvertimeComponent } from './component/template-overtime/dialog-template-overtime.component';
import { TemplateBasicSalaryEffect } from './+state/teamlate-salary-basic/template-basic-salary.effect';
import { templateBasicReducer } from './+state/teamlate-salary-basic/template-basic-salary.reducer';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    StoreModule.forFeature(FeatureName.TEMPLATE_OVERTIME, templateOvertimeReducer),
    StoreModule.forFeature(FeatureName.TEMPLATE_BASIC, templateBasicReducer),
    EffectsModule.forFeature([TemplateOvertimeEffect, TemplateBasicSalaryEffect]),
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
    MatProgressSpinnerModule
  ],
  declarations: [
    TemplateOvertimeComponent,
    SalaryBasicComponent,
    TemplateSalaryBasicComponent,
    DialogTemplateOvertimeComponent,
  ]
})
export class TemplateModule {
}
