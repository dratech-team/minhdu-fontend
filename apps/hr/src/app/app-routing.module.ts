import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './container/default-layout.component';


const routes: Routes = [
  {
    path: 'auth/signin',
    loadChildren: () => import('@minhdu-fontend/auth').then(m => m.AuthModule)
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'profile',
        loadChildren: () => import('./pages/employee/employee.module').then(m => m.EmployeeModule),
        data: {
          title: 'Hồ sơ nhân viên'
        }
      },
      {
        path: 'payroll',
        loadChildren: () => import('./pages/payroll/payroll.module').then(m => m.PayrollModule),
        data: {
          title: 'Danh sách phiếu lương'
        },

      },
      {
        path: 'org-chart',
        loadChildren: () => import('./pages/orgchart/orgchart.module').then(m => m.OrgchartPageModule),
        data: {
          title: 'Hệ thống nhân sự'
        },
      },

      { path: '**', redirectTo: '' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
