import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncubatorFactoryComponent } from './containers/incubator-factory.component';

const routes: Routes = [
  {
    path: '',
    component: IncubatorFactoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncubatorFactoryRoutingModule {}
