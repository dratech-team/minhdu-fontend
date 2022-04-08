import { NgModule } from '@angular/core';
import { CategoryService } from './services';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { WarehouseEffect } from './state';

@NgModule({
  imports: [
    AkitaNgEffectsModule.forFeature([WarehouseEffect])],
  providers: [CategoryService]
})
export class WarehouseModule {
}
