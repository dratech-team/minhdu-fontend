import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './container/default-layout.component';

const routes: Routes = [
  {
    path: 'auth/login',
    loadChildren: () =>
      import('@minhdu-fontend/auth').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home',
    },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/overview/overview-hr.module').then(
            (m) => m.OverviewHrModule
          ),
        data: {
          title: '',
        },
      },
      {
        path: 'ho-so',
        loadChildren: () =>
          import('./pages/employee/employee.module').then(
            (m) => m.EmployeeModule
          ),
        data: {
          title: 'Hồ sơ nhân viên',
        },
      },
      {
        path: 'phieu-luong',
        loadChildren: () =>
          import('./pages/payroll/payroll.module').then((m) => m.PayrollModule),
        data: {
          title: 'Danh sách phiếu lương',
        },
      },
      {
        path: 'ban-mau',
        loadChildren: () =>
          import('./pages/template/template.module').then(
            (m) => m.TemplateModule
          ),
        data: {
          title: 'Thiết lập',
        },
      },
      {
        path: 'he-thong',
        loadChildren: () =>
          import('@minhdu-fontend/system').then((m) => m.SystemModule),
        data: {
          title: 'Lịch sử hệ thống',
        },
      },
      {
        path: 'xep-hang',
        loadChildren: () =>
          import('./pages/rank/rank.module').then((m) => m.RankModule),
        data: {
          title: 'Xếp hạng cuối năm',
        },
      },
      {
        path: 'to-chuc',
        loadChildren: () =>
          import('./pages/orgchart/orgchart.module').then(
            (m) => m.OrgchartModule
          ),
        data: {
          title: 'to-chuc',
        },
      },
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
