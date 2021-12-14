import { NgModule } from '@angular/core';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { OverviewComponent } from './container/overview/overview.component';
import { OverviewRoutingModule } from './overview-routing.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { DetailOverviewComponent } from './components/detail-overview/detail-overview.component';


@NgModule({
  imports: [
    OverviewRoutingModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule
  ],
  declarations: [
    OverviewComponent,
    DetailOverviewComponent
  ],
  exports: [
  ],
})
export class OverviewModule {
}
