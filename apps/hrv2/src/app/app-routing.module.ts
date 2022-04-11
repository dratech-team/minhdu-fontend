import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageLayoutComponent} from "./container/base/page-layout.component";

const routes: Routes = [
  {
    path: '',
    component: PageLayoutComponent,
    children: [],
  },
  {path: '**', redirectTo: ''}
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
