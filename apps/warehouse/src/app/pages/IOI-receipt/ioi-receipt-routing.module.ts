import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IoiPtreceiComponent} from "./container/ioi-receipt/ioi-ptrecei.component";

const routes: Routes = [
  {
    path: '',
    component: IoiPtreceiComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IoiReceiptRoutingModule {
}
