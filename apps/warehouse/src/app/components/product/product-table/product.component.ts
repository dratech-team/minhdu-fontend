import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImportPoultryFoodComponent } from '../../poultry-food/import-poultry-food-dialog/import-poultry-food.component';
import { ImportProductComponent } from '../import-product-dialog/import-product.component';
import { ExportProductComponent } from '../export-product-dialog/export-product.component';


@Component({
  selector:'app-product',
  templateUrl:'product.component.html',
})
export class ProductComponent implements OnInit{

  constructor(
    private readonly dialog: MatDialog,
  ) {
  }
  ngOnInit() {
  }
  importProduct() {
    this.dialog.open(ImportProductComponent,{width:'40%'})
  }

  exportProduct() {
    this.dialog.open(ExportProductComponent,{width:'40%'})
  }
}
