import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SystemHistoryContainer } from './containers/system-history.container';

const routes: Routes = [
  {
    path: '',
    component: SystemHistoryContainer,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemHistoryRoutingModule {
}
