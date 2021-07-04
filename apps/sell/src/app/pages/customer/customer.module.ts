import { NgModule } from '@angular/core';
import { CustomerComponent } from './container/customer.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    CustomerRoutingModule,
    MatInputModule
  ],
  declarations: [
    CustomerComponent
  ]

})
export class customerModule {
}
