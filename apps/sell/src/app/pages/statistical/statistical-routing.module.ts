import { RouterModule, Routes } from '@angular/router';
import { StatisticalComponent } from './container/statistical/statistical.component';
import { NgModule } from '@angular/core';

 const routes: Routes = [
   {
     path: '',
     component: StatisticalComponent,
   }
 ]
@NgModule({
  imports:[RouterModule.forChild(routes)],
  exports:[RouterModule]
})
export class StatisticalRoutingModule {

}
