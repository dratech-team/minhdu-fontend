import { NgModule } from '@angular/core';
import { AppComponent } from '../../container/app.component';
import { StationeryRoutingModule } from './stationery-routing.module';
import { StationeryComponent } from './container/stationery.component';

@NgModule({
  imports: [
    StationeryRoutingModule
  ],
  declarations: [
    StationeryComponent
  ],
  exports: [
    StationeryComponent
  ],
  bootstrap: [AppComponent]
})
export class StationeryModule {
}
