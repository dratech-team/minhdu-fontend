import { NgModule } from '@angular/core';
import { AppComponent } from '../../container/app.component';
import { MedicineRoutingModule } from './medicine-routing.module';
import { MedicineComponent } from './container/medicine.component';

@NgModule({
  imports: [
    MedicineRoutingModule
  ],
  declarations: [
    MedicineComponent
  ],
  exports: [
    MedicineComponent
  ],
  bootstrap: [AppComponent]
})
export class MedicineModule {
}
