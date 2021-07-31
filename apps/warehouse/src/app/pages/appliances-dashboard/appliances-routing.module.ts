import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ApplianceWarehouseComponent } from './container/appliance-warhouse/appliance-warehouse.component';

const routes: Routes = [
  {
    path: '',
    component:ApplianceWarehouseComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppliancesRoutingModule {
}
