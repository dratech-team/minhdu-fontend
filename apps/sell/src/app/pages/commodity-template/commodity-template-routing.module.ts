import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommodityComponent} from "../commodity/container";

const routes: Routes = [
  {
    path: '',
    component:CommodityComponent
  },
]
@NgModule({
  imports:[RouterModule.forChild(routes)],
  exports:[RouterModule]
})
export class commodityTemplateRoutingModule{

}
