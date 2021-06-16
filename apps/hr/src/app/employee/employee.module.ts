import { NgModule } from '@angular/core';
import { ProfileComponent } from './containers/profile/profile.component';
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
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
  imports: [
    EmployeeRoutingModule,
    MatExpansionModule,
    MatMenuModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatRadioModule,
    StoreModule.forFeature('employee', employeeReducer),
    EffectsModule.forFeature([EmployeeEffect]),
    CommonModule,
    MatInputModule,
    InfiniteScrollModule
  ],
  declarations: [
    ProfileComponent,
    AddEmployeeComponent,
  ]
})
export class EmployeeModule {
}
