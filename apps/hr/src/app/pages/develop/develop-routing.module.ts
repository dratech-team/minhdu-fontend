import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DevelopContainer } from './containers/develop.container';


const routes: Routes = [
  {
    path: '',
    component: DevelopContainer
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DevelopRoutingModule {
}
