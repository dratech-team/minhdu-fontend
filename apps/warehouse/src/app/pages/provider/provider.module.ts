import { NgModule } from '@angular/core';
import { ProviderService } from './services/provider.service';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { ProviderEffect } from './state/provider.effect';

@NgModule({
  imports: [AkitaNgEffectsModule.forFeature([ProviderEffect])],
  providers: [ProviderService]
})
export class ProviderModule {
}
