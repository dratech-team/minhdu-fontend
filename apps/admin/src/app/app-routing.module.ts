import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdminLayoutComponent } from './containers/layout-admin/admin-layout.component';
import { AppContainer } from './containers/app/app.container';

const routes: Routes = [
  {
    path: '',
    component: AppContainer
  },
  {
    path: 'auth/login',
    loadChildren: () =>
      import('@minhdu-fontend/auth').then((m) => m.AuthModule)
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: []
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      initialNavigation: 'enabledBlocking'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
