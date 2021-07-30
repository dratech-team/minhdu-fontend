import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { WarehouseLayoutComponent } from './container/warehouse-layout.component';

const routes: Routes = [
  {
    path:'',
    component:WarehouseLayoutComponent,
    children:[
      {
        path:'',
        loadChildren:() =>
          import('./child-dashboard/main-dashboard/main-dashboard.module').then(m => m.MainDashboardModule)
      },
      {
        path:'kho-thuoc',
        loadChildren:() =>
          import('./child-dashboard/medicine-dashboard/medicine.module').then(m => m.MedicineModule)
      },
      {
        path:'kho-thuc-pham',
        loadChildren:() =>
          import('./child-dashboard/poultry-food-dashboard/poultry-food.module').then(m => m.PoultryFoodModule)
      },
      {
        path:'kho-san-pham',
        loadChildren:() => import('./child-dashboard/Product-dashboard/product.module').then(m => m.ProductModule)
      },
      {
        path:'kho-thiet-bi',
        loadChildren:() => import('./child-dashboard/appliances-dashboard/appliances.module').then(m => m.AppliancesModule)
      },
      {
        path:'kho-van-phong-pham',
        loadChildren:() => import('./child-dashboard/requisite-dashboard/requisite.module').then(m => m.RequisiteModule)
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
