import { NgModule } from '@angular/core';
import { ComponentsModule } from '@minhdu-fontend/components';
import { MatDialogModule } from '@angular/material/dialog';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OverviewHrRoutingModule } from './overview-hr-routing.module';
import { OverviewHrComponent } from './containers/overview/overview-hr.component';
import { StatisticalEmployeeComponent } from './components/dialog-statistical-employee/statistical-employee.component';
import { MatDatepickerModule } from '@angular/material/datepicker';



@NgModule({
  imports: [
    ComponentsModule,
    StoreModule,
    EffectsModule,
    InfiniteScrollModule,
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    FormsModule,
    NgxSkeletonLoaderModule.forRoot(),
    MatProgressBarModule,
    MatProgressSpinnerModule,
    OverviewHrRoutingModule,
    MatDialogModule,
    MatDatepickerModule
  ],
  exports: [
    OverviewHrComponent
  ],
  declarations: [
    OverviewHrComponent,
    StatisticalEmployeeComponent
  ]
})
export class OverviewHrModule {
}
