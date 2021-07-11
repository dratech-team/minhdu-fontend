import { NgModule } from '@angular/core';
import { CustomerComponent } from './container/customer/customer.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ComponentsModule } from '@minhdu-fontend/components';
import { CommonModule, DatePipe } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { customerReducer } from './+state/customer.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CustomerEffect } from './+state/customer.effect';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DetailCustomerComponent } from './container/detail-customer/detail-customer.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { CustomerDialogComponent } from './component/customer-dialog/customer-dialog.component';
import { PickCustomerComponent } from './component/pick-customer.component/pick-customer.component';
import { PickCustomerService } from './component/pick-customer.component/pick-customer.service';


@NgModule({
  imports: [
    ComponentsModule,
    MatSnackBarModule,
    HttpClientModule,
    ComponentsModule,
    CustomerRoutingModule,
    MatInputModule,
    InfiniteScrollModule,
    CommonModule,
    StoreModule.forFeature(FeatureName.CUSTOMER, customerReducer),
    EffectsModule.forFeature([CustomerEffect]),
    MatCheckboxModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatRadioModule,
    MatDialogModule,
    FormsModule
  ],
  declarations: [
    CustomerComponent,
    DetailCustomerComponent,
    CustomerDialogComponent,
    PickCustomerComponent
  ],
  exports: [
    PickCustomerComponent
  ],
  providers: [
    DatePipe,
    PickCustomerService
  ]

})
export class customerModule {
}
