import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { WarehouseLayoutComponent } from './container/base/warehouse-layout.component';

const routes: Routes = [

  {
    path:'',
    component:WarehouseLayoutComponent,
    children:[
      {
        path:'',
        loadChildren:() =>
          import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path:'kho-thuoc',
        loadChildren:() =>
          import('./container/dashboard/medicine/medicine.module').then(m => m.MedicineModule)
      },
      {
        path:'kho-thuc-pham',
        loadChildren:() =>
          import('./container/dashboard/poultry-food/poultry-food.module').then(m => m.PoultryFoodModule)
      },

    ]
  }


];
@NgModule({
  imports:[RouterModule.forRoot(routes, { useHash: true, initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
