import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AccountManagementContainer } from './containers/account-management/account-management.container';
import { SystemHistoryContainer } from './containers/system-history/system-history/system-history.container';

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
