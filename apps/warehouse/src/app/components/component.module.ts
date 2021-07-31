import { NgModule } from '@angular/core';
import { ApplianceComponent } from './appliance/appliance.component';
import { MedicineComponent } from './medicine/medicine.component';
import { PoultryFoodComponent } from './poultry-food/poultry-food.component';
import { ProductComponent } from './product/product.component';
import { RequisiteComponent } from './requisite/requisite.component';



@NgModule({
  imports: [
  ],
  declarations: [
    RequisiteComponent,
    ProductComponent,
    PoultryFoodComponent,
    MedicineComponent,
    ApplianceComponent,
  ],
  exports: [
    RequisiteComponent,
    ProductComponent,
    PoultryFoodComponent,
    MedicineComponent,
    ApplianceComponent,
  ],
})
export class ComponentModule {
}
