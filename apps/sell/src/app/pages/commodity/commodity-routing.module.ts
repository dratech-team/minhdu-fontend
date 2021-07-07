import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommodityComponent } from './container/commodity/commodity.component';

const routes:Routes = [
  {
    path: '',
    component: CommodityComponent
  }
]
@NgModule({
  imports:[RouterModule.forChild(routes)],
  exports:[RouterModule]
})
export class CommodityRoutingModule {

}
