import { NgModule } from '@angular/core';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { EggTypeService } from './services/egg-type.service';
import { EggTypeEffect } from './state/egg-type.effect';

@NgModule({
  imports: [AkitaNgEffectsModule.forFeature([EggTypeEffect])],
  providers: [EggTypeService],
})
export class EggTypeModule {}
