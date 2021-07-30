import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RequisiteComponent } from './container/requisite-warehouse/requisite.component';

const routes: Routes = [
  {
    path: '',
    component:RequisiteComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequisiteRoutingModule {
}
