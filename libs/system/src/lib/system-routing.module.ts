import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SystemHistoryContainer } from './containers/system-history/system-history.container';
import { AccountManagementContainer } from './containers/account-management/account-management.container';

const routes: Routes = [
  {
    path: 'lich-su-he-thong',
    component: SystemHistoryContainer
  },
  {
    path: 'quan-ly-tai-khoan',
    component: AccountManagementContainer
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule {
}
