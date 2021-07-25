import { NgModule } from '@angular/core';
import { AppComponent } from '../../container/app.component';
import { MainDashboardComponent } from './container/main-dashboard.component';
import { MainDashboardRoutingModule } from './main-dashboard-routing.module';

@NgModule({
  imports: [
    MainDashboardRoutingModule
  ],
  declarations: [
    MainDashboardComponent
  ],
  exports: [
    MainDashboardComponent
  ],
  bootstrap: [AppComponent]
})
export class MainDashboardModule {
}
