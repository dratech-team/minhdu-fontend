import {NgModule} from '@angular/core';
import {WarehouseService} from './services/warehouse.service';
import {AkitaNgEffectsModule} from '@datorama/akita-ng-effects';
import {WarehouseEffect} from './state/warehouse.effect';

@NgModule({
  imports: [
    AkitaNgEffectsModule.forFeature([WarehouseEffect])],
  providers: [WarehouseService]
})
export class WarehouseModule {
}
