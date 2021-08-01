import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MedicineWarehouseComponent } from './container/medicine-warhouse/medicine-warehouse.component';
import { DetailMedicineComponent } from '../../components/medicine/detail-medicine/detail-medicine.component';

const routes: Routes = [
  {
    path: '',
    component:MedicineWarehouseComponent
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
