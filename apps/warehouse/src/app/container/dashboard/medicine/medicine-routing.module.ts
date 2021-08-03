import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MedicineComponent } from './container/medicine/medicine.component';

const routes: Routes = [
  {
    path: '',
    component:MedicineComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicineRoutingModule {
}
