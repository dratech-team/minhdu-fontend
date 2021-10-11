import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { StoreModule } from '@ngrx/store';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EmployeeModule } from '../employee/employee.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DevelopRoutingModule } from './develop-routing.module';
import { DevelopContainer } from './containers/develop.container';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DialogMaintain } from './components/dialog-maintain';
import { FilterPipe } from './pipe/filter.pipe';

@NgModule({
  imports: [
    StoreModule,
    MatDialogModule,
    InfiniteScrollModule,
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    FormsModule,
    NgxSkeletonLoaderModule.forRoot(),
    MatProgressBarModule,
    DevelopRoutingModule,
    MatSlideToggleModule
  ],
  declarations: [
    DevelopContainer,
    DialogMaintain,
    FilterPipe
  ]
})
export class DevelopModule {
}
