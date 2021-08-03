import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MaterialComponent } from './container/material/material.component';


const routes: Routes = [
  {
    path: '',
    component:MaterialComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialRoutingModule {
}
