import { NgModule } from '@angular/core';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { IncubatorFactoryService } from './services/incubator-factory.service';
import { IncubatorFactoryEffect } from './state/incubator-factory.effect';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    AkitaNgEffectsModule.forFeature([IncubatorFactoryEffect])
  ],
  providers: [IncubatorFactoryService]
})
export class IncubatorFactoryModule {
}
