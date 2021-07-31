import { Component, Input, OnInit } from '@angular/core';
import { WarehouseTypeEnum } from '@minhdu-fontend/enums';
import { Medicine } from '../../pages/medicine-dashboard/+state/medicine.interface';


@Component({
  selector:'app-medicine',
  templateUrl:'medicine.component.html',
})
export class MedicineComponent implements OnInit{
    @Input() warehouseType!: WarehouseTypeEnum
    @Input() medicine: Medicine[] = []
    warehouseTypeEnum = WarehouseTypeEnum
  constructor() {
  }
  ngOnInit() {
  }

  importMedicine() {

  }

  exportMedicine() {

  }
}
