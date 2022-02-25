import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BreedLayoutComponent} from "./container/base/breed-layout.component";

const routes: Routes = [
  {
    path: 'auth/login',
    loadChildren: () => import('@minhdu-fontend/auth').then(m => m.AuthModule)
  },
  {
    path: '',
    component:BreedLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'nha-may-ap',
        loadChildren: () =>
          import('./pages/incubator-factory/incubator-factory.module').then(
            (m) => m.IncubatorFactoryModule
          )
      },
      { path: '**', redirectTo: '' }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      initialNavigation: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
