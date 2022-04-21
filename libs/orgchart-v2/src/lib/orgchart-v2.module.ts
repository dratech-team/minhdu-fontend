import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AkitaNgEffectsModule} from "@datorama/akita-ng-effects";
import {BranchEffects} from "./branch/state";
import {PositionEffects} from "./position/state";

@NgModule({
  imports: [
    CommonModule,
    AkitaNgEffectsModule.forFeature([BranchEffects,PositionEffects])
  ],
})
export class OrgchartV2Module {}
