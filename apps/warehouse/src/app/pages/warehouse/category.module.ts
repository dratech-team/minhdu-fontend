import { NgModule } from '@angular/core';
import { CategoryService } from './services';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { CategoryEffect } from './state';

@NgModule({
  imports: [
    AkitaNgEffectsModule.forFeature([CategoryEffect])],
  providers: [CategoryService]
})
export class CategoryModule {
}
