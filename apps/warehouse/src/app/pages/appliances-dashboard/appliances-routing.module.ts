import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ApplianceWarehouseComponent } from './container/appliance-warhouse/appliance-warehouse.component';
import { DetailApplianceComponent } from '../../components/appliance/detail-appliance/detail-appliance.component';

const routes: Routes = [
  {
    path: '',
    component:ApplianceWarehouseComponent
  },
  {
    path: 'chi-tiet-thiet-bi',
    component:DetailApplianceComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppliancesRoutingModule {
}
