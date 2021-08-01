import { Component, Input, OnInit } from '@angular/core';
import { WarehouseTypeEnum } from '@minhdu-fontend/enums';
import { PoultryFood } from '../../../pages/poultry-food-dashboard/+state/poultry-food.interface';
import { MatDialog } from '@angular/material/dialog';
import { ImportPoultryFoodComponent } from '../import-poultry-food-dialog/import-poultry-food.component';
import { ExportPoultryFoodComponent } from '../export-poultry-food-dialog/export-poultry-food.component';
import {  Router } from '@angular/router';


@Component({
  selector:'app-poultry-food',
  templateUrl:'poultry-food.component.html',
})
export class PoultryFoodComponent implements OnInit{
  @Input() warehouseType!: WarehouseTypeEnum
  @Input() medicine: PoultryFood[] = []
  warehouseTypeEnum = WarehouseTypeEnum
  constructor(
    private readonly dialog: MatDialog,
    private readonly router: Router,
  ) {
  }
  ngOnInit() {
  }

  importPoultryFood() {
    this.dialog.open(ImportPoultryFoodComponent,{width:'40%'})
  }

  exportPoultryFood() {
    this.dialog.open(ExportPoultryFoodComponent,{width:'40%'})
  }

  detailPoultryFood() {
    if (this.warehouseType) {
      this.router.navigate(['kho-thuc-pham/chi-tiet-thuc-pham']).then();
    } else {
      this.router.navigate(['chi-tiet-thuc-pham']).then();
    }
  }
}
