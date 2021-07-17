import { NgModule } from '@angular/core';
import { EmployeeRoutingModule } from './employee-routing.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CommonModule, DatePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DetailEmployeeComponent } from './containers/detail-employee/detail-employee.component';
import { AddProfileComponent } from './components/profile/add-profile.component';
import { AddRelativeComponent } from './components/relative/add-relative.component';
import { ComponentsModule } from '@minhdu-fontend/components';
import { AddEmployeeComponent } from './components/employee/add-employee.component';
import { AddDegreeComponent } from './components/degree/add-degree.component';
import { DeleteEmployeeComponent } from './components/dialog-delete-employee/delete-employee.component';
import { EmployeeComponent } from './containers/employee/employee.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EmployeeLibModule } from '@minhdu-fontend/employee';
import { LocationModule } from '@minhdu-fontend/location';


@NgModule({
  imports: [
    LocationModule,
    EmployeeLibModule,
    ComponentsModule,
    EmployeeRoutingModule,
    MatExpansionModule,
    MatMenuModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatRadioModule,
    StoreModule,
    EffectsModule,
    CommonModule,
    MatInputModule,
    InfiniteScrollModule,
    FormsModule,
    MatCheckboxModule
  ],
  declarations: [
    AddDegreeComponent,
    EmployeeComponent,
    AddDegreeComponent,
    AddEmployeeComponent,
    DetailEmployeeComponent,
    AddRelativeComponent,
    AddProfileComponent,
    DeleteEmployeeComponent,
  ],
  providers: [
    DatePipe,
  ],
})

export class EmployeeModule {
}
