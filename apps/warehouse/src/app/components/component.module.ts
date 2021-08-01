import { NgModule } from '@angular/core';
import { ApplianceComponent } from './appliance/appliance-table/appliance.component';
import { MedicineComponent } from './medicine/medicine-table/medicine.component';
import { PoultryFoodComponent } from './poultry-food/poultry-food-table/poultry-food.component';
import { ProductComponent } from './product/product-table/product.component';
import { RequisiteComponent } from './requisite/requisite-table/requisite.component';
import { CommonModule } from '@angular/common';
import { ImportApplianceComponent } from './appliance/import-appliance-dialog/import-appliance.component';
import { ExportApplianceComponent } from './appliance/export-appliance-dialog/export-appliance.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ImportMedicineComponent } from './medicine/import-medicine-dialog/import-medicine.component';
import { ExportMedicineComponent } from './medicine/export-medicine-dialog/export-medicine.component';
import { ExportPoultryFoodComponent } from './poultry-food/export-poultry-food-dialog/export-poultry-food.component';
import { ImportPoultryFoodComponent } from './poultry-food/import-poultry-food-dialog/import-poultry-food.component';
import { ExportRequisiteComponent } from './requisite/export-requisite-dialog/export-requisite.component';
import { ImportRequisiteComponent } from './requisite/import-requisite-dialog/import-requisite.component';
import { ImportProductComponent } from './product/import-product-dialog/import-product.component';
import { ExportProductComponent } from './product/export-product-dialog/export-product.component';
import { DetailMedicineComponent } from './medicine/detail-medicine/detail-medicine.component';
import { DetailApplianceComponent } from './appliance/detail-appliance/detail-appliance.component';
import { DetailPoultryFoodComponent } from './poultry-food/detail-poultry-food/detail-poultry-food.component';
import { DetailRequisiteComponent } from './requisite/detail-requisite/detail-requisite.component';



@NgModule({
  imports: [
    CommonModule,
    MatDialogModule
  ],
  declarations: [
    DetailRequisiteComponent,
    DetailPoultryFoodComponent,
    DetailApplianceComponent,
    DetailMedicineComponent,
    ExportProductComponent,
    ImportProductComponent,
    ImportRequisiteComponent,
    ExportRequisiteComponent,
    ImportPoultryFoodComponent,
    ExportPoultryFoodComponent,
    ExportMedicineComponent,
    ImportMedicineComponent,
    ExportApplianceComponent,
    ImportApplianceComponent,
    RequisiteComponent,
    ProductComponent,
    PoultryFoodComponent,
    MedicineComponent,
    ApplianceComponent,
  ],
  exports: [
    DetailRequisiteComponent,
    DetailPoultryFoodComponent,
    DetailApplianceComponent,
    DetailMedicineComponent,
    ExportProductComponent,
    ImportProductComponent,
    ImportRequisiteComponent,
    ExportRequisiteComponent,
    ImportPoultryFoodComponent,
    ExportPoultryFoodComponent,
    ExportApplianceComponent,
    ImportApplianceComponent,
    RequisiteComponent,
    ProductComponent,
    PoultryFoodComponent,
    MedicineComponent,
    ApplianceComponent,
  ],
})
export class ComponentModule {
}
