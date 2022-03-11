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
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { BHYTComponent } from './components/bhyt/BHYT.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { UpdateContractComponent } from './components/dialog-update-contract/update-contract.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FilterDayWorkHistoryPipe } from './pipes/filter-day-work-history.pipe';
import { DialogCategoryComponent } from './components/category/dialog-category.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSortModule } from '@angular/material/sort';
import { NzMessageModule } from 'ng-zorro-antd/message';
import {NzAutocompleteModule} from "ng-zorro-antd/auto-complete";

@NgModule({
  imports: [
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
    MatCheckboxModule,
    NgxSkeletonLoaderModule.forRoot(),
    MatAutocompleteModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
    MatTabsModule,
    DragDropModule,
    CommonModule,
    MatSortModule,
    NzMessageModule,
    NzAutocompleteModule
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
    BHYTComponent,
    UpdateContractComponent,
    FilterDayWorkHistoryPipe,
    DialogCategoryComponent
  ],
  providers: [DatePipe]
})
export class EmployeeModule {
}
