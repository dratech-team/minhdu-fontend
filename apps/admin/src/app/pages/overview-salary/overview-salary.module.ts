import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { DetailOverviewComponent } from './container/detail-overview/detail-overview.component';
import { OverviewSalaryComponent } from './container/overview-salary/overview-salary.component';
import { OverviewSalaryRoutingModule } from './overview-salary-routing.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [
    OverviewSalaryRoutingModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatDialogModule,
  ],
  declarations: [OverviewSalaryComponent, DetailOverviewComponent],
  providers: [DatePipe],
  exports: [],
})
export class OverviewSalaryModule {}
