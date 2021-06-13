import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  // {
  //   path: 'auth/signin',
  //   component: AuthComponent,
  // },
  {
    path: '',
    component: AppComponent,
    data: {
      title: 'Home',
    },
      // children: [
      //   {
      //     path: 'profile',
      //     loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule),
      //     data: {
      //       title: 'Hồ sơ nhân viên',
      //     },
      //   },
      //   // { path: '**', redirectTo: '' },
      //   ]
    //     {
    //       path: 'detail-employee/:id',
    //       component: EmployeeDetailComponent,
    //       data: {
    //         title: 'Chi tiết nhân viên',
    //       },
    //     },
    //     {
    //       path: 'payroll',
    //       loadChildren: () =>
    //         import('./pages/payroll/payroll.module').then((m) => m.PayrollModule),
    //     },
    //     {
    //       path: 'org-chart',
    //       data: {
    //         title: 'Hệ thống nhân sự',
    //       },
    //       loadChildren: () =>
    //         import('./pages/org-chart/org-chart.module').then(
    //           (m) => m.OrgChartModule
    //         ),
    //     },
    //     // otherwise redirect to home

    //   ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, initialNavigation: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
