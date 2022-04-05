import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MigrateComponent} from './containers';
import {ImportCommodityComponent} from "./components/import-commodity/import-commodity.component";
import {ExportCommodityComponent} from "./components/export-commodity/export-commodity.component";

const routes: Routes = [
  {
    path: '',
    component: MigrateComponent,
    children:[
      {
        path: '',
        component: ImportCommodityComponent
      },
      {
        path: 'xuat-kho',
        component: ExportCommodityComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MigrateRoutingModule {
}
