import { NgModule } from '@angular/core';
import { ProfileComponent } from './containers/profile/profile.component';
import { EmployeeRoutingModule } from './employee-routing.module';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  imports: [EmployeeRoutingModule, MatExpansionModule],
  declarations: [
    ProfileComponent
  ]
})
export class EmployeeModule {
}
