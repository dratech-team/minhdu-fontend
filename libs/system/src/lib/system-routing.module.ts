import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AccountManagementComponent } from './containers/account-management/account-management.component';
import { SystemHistoryContainer } from './containers/system-history/system-history.container';
import { LimitedAccessContainer } from './containers/limited-access/limited-access.container';

const routes: Routes = [
  {
    path: '',
    component: SystemHistoryContainer
  },
  {
    path: 'quan-ly-tai-khoan',
    component: AccountManagementComponent
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
