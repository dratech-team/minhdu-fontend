import { NgModule } from '@angular/core';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { IncubatorFactoryService } from './services/incubator-factory.service';
import { IncubatorFactoryRoutingModule } from './incubator-factory-routing.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { IncubatorFactoryEffect } from './state/incubator-factory.effect';
import { IncubatorFactoryComponent } from './containers/incubator-factory.component';
import { AddEggComponent } from './components/dialog-add-egg/add-egg.component';
import { EggService } from './services/egg.service';
import { ReactiveFormsModule } from '@angular/forms';
import { EggTypeModule } from '../egg-type/egg-type.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [IncubatorFactoryComponent, AddEggComponent],
  imports: [
    IncubatorFactoryRoutingModule,
    AkitaNgEffectsModule.forFeature([IncubatorFactoryEffect]),
    MatAutocompleteModule,
    CommonModule,
    ReactiveFormsModule,
    EggTypeModule,
    MatDatepickerModule,
    InfiniteScrollModule,
    MatSelectModule,
  ],
  providers: [IncubatorFactoryService, EggService],
})
export class IncubatorFactoryModule {}
