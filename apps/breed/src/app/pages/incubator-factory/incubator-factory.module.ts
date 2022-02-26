import { NgModule } from '@angular/core';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { IncubatorFactoryService } from './services/incubator-factory.service';
import { IncubatorFactoryRoutingModule } from './incubator-factory-routing.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { IncubatorFactoryEffect } from './state/incubator-factory.effect';
import { IncubatorFactoryComponent } from './containers/incubator-factory.component';
import { EggService } from './services/egg.service';

@NgModule({
  declarations: [
    IncubatorFactoryComponent
  ],
  imports: [
    IncubatorFactoryRoutingModule,
    AkitaNgEffectsModule.forFeature([IncubatorFactoryEffect]),
    MatAutocompleteModule,
    CommonModule
  ],
  providers: [IncubatorFactoryService, EggService]
})
export class IncubatorFactoryModule {
}
