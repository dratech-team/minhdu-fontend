import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { DetailMedicineComponent } from '../../components/medicine/detail-medicine/detail-medicine.component';
import { DetailPoultryFoodComponent } from '../../components/poultry-food/detail-poultry-food/detail-poultry-food.component';
import { DetailRequisiteComponent } from '../../components/requisite/detail-requisite/detail-requisite.component';
import { DetailApplianceComponent } from '../../components/appliance/detail-appliance/detail-appliance.component';

const routes: Routes = [
  {
    path: '',
    component:DashboardComponent
  },
  {
    path: 'chi-tiet-thuoc',
    component: DetailMedicineComponent,
  },
  {
    path: 'chi-tiet-thuc-pham',
    component: DetailPoultryFoodComponent,
  },
  {
    path: 'chi-tiet-thiet-bi',
    component: DetailApplianceComponent,
  },
  {
    path: 'chi-tiet-van-phong-pham',
    component: DetailRequisiteComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
