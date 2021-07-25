import { NgModule } from '@angular/core';
import { AppComponent } from '../../container/app.component';
import { AppliancesRoutingModule } from './appliances-routing.module';
import { ApplianceComponent } from './container/appliance.component';

@NgModule({
  imports: [
    AppliancesRoutingModule
  ],
  declarations: [
    ApplianceComponent
  ],
  exports: [
    ApplianceComponent
  ],
  bootstrap: [AppComponent]
})
export class AppliancesModule {
}
