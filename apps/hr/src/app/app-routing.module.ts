import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';

const routes: Routes = [
  // {
  //   path: 'auth/signin',
  //   component: AuthComponent,
  // },
  {
    path: '',
    loadChildren: () => import('@minhdu-fontend/components').then(m => m.ComponentsModule),
    data: {
      title: 'Home',
    },
    //   canActivate: [AuthGuard],
    //   children: [
    //     {
    //       path: 'employee',
    //       component: EmployeeComponent,
    //       data: {
    //         title: 'Danh sách nhân viên',
    //       },
    //     },
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
    //     { path: '**', redirectTo: '' },
    //   ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
