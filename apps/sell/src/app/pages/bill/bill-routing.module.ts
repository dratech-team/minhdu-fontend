import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BillComponent } from './container/bill/bill.component';
import { DetailBillComponent } from './container/detail-bill/detail-bill.component';

export const routes: Routes = [
  {
    path: '',
    component: BillComponent,
  },
  {
    path: '/detail-bill:id',
    component: DetailBillComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillRoutingModule {}
