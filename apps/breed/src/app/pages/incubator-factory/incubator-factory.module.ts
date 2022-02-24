import {NgModule} from '@angular/core';
import {AkitaNgEffectsModule} from '@datorama/akita-ng-effects';
import {IncubatorFactoryService} from './services/incubator-factory.service';
import {incubatorFactoryComponent} from "./containers/incubator-factory.component";
import {IncubatorFactoryRoutingModule} from "./incubator-factory-routing.module";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
    incubatorFactoryComponent
  ],
  imports: [
    IncubatorFactoryRoutingModule,
    AkitaNgEffectsModule.forFeature([]),
    MatAutocompleteModule,
    CommonModule,
  ],
  providers: [IncubatorFactoryService]
})
export class IncubatorFactoryModule {
}
