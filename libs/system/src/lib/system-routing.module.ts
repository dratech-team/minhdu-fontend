import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AccountManagementComponent } from './containers/account-management/account-management.component';
import { systemHistoryComponent } from './containers/system-history/system-history.component';
import { LimitedAccessComponent } from './containers/limited-access/limited-access.component';

const routes: Routes = [
  {
    path: '',
    component: systemHistoryComponent
  },
  {
    path: 'quan-ly-tai-khoan',
    component: AccountManagementComponent
  },
  {
    path: 'han-che-truy-cap',
    component: LimitedAccessComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule {
}
