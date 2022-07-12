import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommodityTemplateComponent } from './container/commodity-template.component';

const routes: Routes = [
  {
    path: '',
    component: CommodityTemplateComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class commodityTemplateRoutingModule {}
