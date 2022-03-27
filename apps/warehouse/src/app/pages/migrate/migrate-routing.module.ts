import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { MigrateComponent } from './containers';

const routes: Routes = [
  {
    path: '',
    component: MigrateComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MigrateRoutingModule {
}
