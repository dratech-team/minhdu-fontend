import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { StatisticalPersonnelComponent } from './container/statistical-personnel/statistical-personnel.component';

const routes: Routes = [
  {
    path: '',
    component: StatisticalPersonnelComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatisticalPersonnelRoutingModule {}
