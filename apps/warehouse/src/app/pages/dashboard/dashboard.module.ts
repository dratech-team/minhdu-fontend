import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DashboardRoutingModule} from "./dashboard-routing.module";
import {DashboardComponentComponent} from "./container/dashboard/dashboard-component.component";
import {ComponentsModule} from "@minhdu-fontend/components";


@NgModule({
  declarations: [DashboardComponentComponent],
  imports: [
    ComponentsModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DashboardRoutingModule,
  ],

})
export class DashboardModule {
}
