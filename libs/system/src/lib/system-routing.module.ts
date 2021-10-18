import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AccountManagementContainer } from './containers/account-management/account-management.container';
import { SystemHistoryContainer } from './containers/system-history/system-history/system-history.container';
import { LimitedAccessContainer } from './containers/limited-access/limited-access.container';

const routes: Routes = [
  {
    path: 'lich-su-he-thong',
    component: SystemHistoryContainer
  },
  {
    path: 'quan-ly-tai-khoan',
    component: AccountManagementContainer
  },
  {
    path: 'han-che-truy-cap',
    component: LimitedAccessContainer
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule {
}
