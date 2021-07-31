import { Component, Input, OnInit } from '@angular/core';
import { WarehouseTypeEnum } from '@minhdu-fontend/enums';
import { Appliance } from '../../pages/appliances-dashboard/+state/appliance.interface';
import { Requisite } from '../../pages/requisite-dashboard/+state/requisite .interface';

@Component({
  selector:'app-requisite',
  templateUrl:'requisite.component.html',
})
export class RequisiteComponent implements OnInit{
  @Input() warehouseType!: WarehouseTypeEnum
  @Input() requisite: Requisite[] = []
  warehouseTypeEnum = WarehouseTypeEnum
  constructor(
  ) {
  }
  ngOnInit() {
  }
  importRequisite() {

  }
}
