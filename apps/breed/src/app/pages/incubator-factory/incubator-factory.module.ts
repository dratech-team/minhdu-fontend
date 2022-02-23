import { NgModule } from '@angular/core';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { IncubatorFactoryService } from './services/incubator-factory.service';

@NgModule({
  imports: [AkitaNgEffectsModule.forFeature([])],
  providers: [IncubatorFactoryService]
})
export class IncubatorFactoryModule {
}
