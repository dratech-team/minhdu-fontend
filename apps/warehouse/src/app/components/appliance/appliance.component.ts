import { Component, Input, OnInit } from '@angular/core';
import { WarehouseTypeEnum } from '@minhdu-fontend/enums';
import { Appliance } from '../../pages/appliances-dashboard/+state/appliance.interface';

@Component({
  selector:'app-appliance',
  templateUrl:'appliance.component.html',
})
export class ApplianceComponent implements OnInit{
  @Input() warehouseType!: WarehouseTypeEnum
  @Input() appliance: Appliance[] = []
  warehouseTypeEnum = WarehouseTypeEnum
  constructor(

  ) {
  }
  ngOnInit() {

  }
  importAppliance() {

  }
}
