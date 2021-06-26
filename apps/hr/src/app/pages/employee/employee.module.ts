import { NgModule } from '@angular/core';
import { EmployeeRoutingModule } from './employee-routing.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { StoreModule } from '@ngrx/store';
import { employeeReducer } from './+state/employee.reducers';
import { EffectsModule } from '@ngrx/effects';
import { EmployeeEffect } from './+state/employee.effect';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DetailEmployeeComponent } from './containers/detail-employee/detail-employee.component';
import { AddProfileComponent } from './components/profile/add-profile.component';
import { AddRelativeComponent } from './components/relative/add-relative.component';
import { ComponentsModule } from '@minhdu-fontend/components';
import { ProfileComponent } from './containers/profile/profile.component';
import { AddEmployeeComponent } from './components/employee/add-employee.component';
import { AddDegreeComponent } from './components/degree/add-degree.component';
import { FeatureName } from '@minhdu-fontend/constants';

@NgModule({
  imports: [
    ComponentsModule,
    EmployeeRoutingModule,
    MatExpansionModule,
    MatMenuModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatRadioModule,
    StoreModule.forFeature(FeatureName.EMPLOYEE, employeeReducer),
    EffectsModule.forFeature([EmployeeEffect]),
    CommonModule,
    MatInputModule,
    InfiniteScrollModule
  ],
  declarations: [
    AddDegreeComponent,
    ProfileComponent,
    AddDegreeComponent,
    AddEmployeeComponent,
    DetailEmployeeComponent,
    AddRelativeComponent,
    AddProfileComponent
  ]
})
export class EmployeeModule {
}
