import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ApplianceComponent } from './container/appliance.component';

const routes: Routes = [
  {
    path: '',
    component:ApplianceComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppliancesRoutingModule {
}
