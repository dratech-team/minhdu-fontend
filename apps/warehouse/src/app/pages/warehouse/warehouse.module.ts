import { NgModule } from '@angular/core';
import { WarehouseService } from './services';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { WarehouseEffect } from './state';

@NgModule({
  imports: [
    AkitaNgEffectsModule.forFeature([WarehouseEffect])],
  providers: [WarehouseService]
})
export class WarehouseModule {
}
