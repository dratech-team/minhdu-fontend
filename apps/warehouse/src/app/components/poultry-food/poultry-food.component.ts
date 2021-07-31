import { Component, Input, OnInit } from '@angular/core';
import { WarehouseTypeEnum } from '@minhdu-fontend/enums';
import { Medicine } from '../../pages/medicine-dashboard/+state/medicine.interface';
import { PoultryFood } from '../../pages/poultry-food-dashboard/+state/poultry-food.interface';


@Component({
  selector:'app-poultry-food',
  templateUrl:'poultry-food.component.html',
})
export class PoultryFoodComponent implements OnInit{
  @Input() warehouseType!: WarehouseTypeEnum
  @Input() medicine: PoultryFood[] = []
  warehouseTypeEnum = WarehouseTypeEnum
  constructor(
  ) {
  }
  ngOnInit() {

  }

  importPoultryFood() {

  }
}
