import { NgModule } from '@angular/core';
import { AppComponent } from '../../container/app.component';
import { PoultryFoodRoutingModule } from './poultry-food-routing.module';
import { PoultryFoodComponent } from './container/poultry-food.component';

@NgModule({
  imports: [
    PoultryFoodRoutingModule
  ],
  declarations: [
    PoultryFoodComponent
  ],
  exports: [
    PoultryFoodComponent
  ],
  bootstrap: [AppComponent]
})
export class PoultryFoodModule {
}
