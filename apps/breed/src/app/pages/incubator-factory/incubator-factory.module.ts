import { NgModule } from '@angular/core';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { IncubatorFactoryService } from './services/incubator-factory.service';
import { IncubatorFactoryRoutingModule } from './incubator-factory-routing.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { IncubatorFactoryEffect } from './state/incubator-factory.effect';
import { IncubatorFactoryComponent } from './containers/incubator-factory.component';

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
  providers: [IncubatorFactoryService]
})
export class IncubatorFactoryModule {
}
