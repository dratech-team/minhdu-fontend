import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MedicineComponent } from './container/medicine/medicine.component';
import { DetailMedicineComponent } from '../../../components/medicine/detail-medicine/detail-medicine.component';

const routes: Routes = [
  {
    path: '',
    component:MedicineComponent
  },
  {
    path: 'chi-tiet-thuoc',
    component:DetailMedicineComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicineRoutingModule {
}
