import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PositionContainer } from './container/position/position.container';



const routes: Routes = [
  {
    path: '',
    component:PositionContainer,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class OrgchartNewRoutingModule {
}
