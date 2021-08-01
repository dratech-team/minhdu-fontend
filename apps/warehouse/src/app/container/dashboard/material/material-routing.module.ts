import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MaterialComponent } from './container/material/material.component';
import { DetailApplianceComponent } from '../../components/appliance/detail-appliance/detail-appliance.component';

const routes: Routes = [
  {
    path: '',
    component:MaterialComponent
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
export class MaterialRoutingModule {
}
