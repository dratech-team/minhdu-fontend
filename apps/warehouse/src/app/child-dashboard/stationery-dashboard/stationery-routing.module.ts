import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { StationeryComponent } from './container/stationery.component';

const routes: Routes = [
  {
    path: '',
    component:StationeryComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StationeryRoutingModule {
}
