import {NgModule} from '@angular/core';
import {AkitaNgEffectsModule} from '@datorama/akita-ng-effects';
import {IncubatorFactoryService} from './services/incubator-factory.service';
import {incubatorFactoryComponent} from "./containers/incubator-factory.component";
import {IncubatorFactoryRoutingModule} from "./incubator-factory-routing.module";

@NgModule({
  declarations: [
    incubatorFactoryComponent
  ],
  imports: [
    IncubatorFactoryRoutingModule,
    AkitaNgEffectsModule.forFeature([])
  ],
  providers: [IncubatorFactoryService]
})
export class IncubatorFactoryModule {
}
