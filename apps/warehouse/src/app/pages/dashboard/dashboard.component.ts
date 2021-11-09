import { Component, OnInit } from '@angular/core';
import { WarehouseTypeEnum } from '@minhdu-fontend/enums';
import { WarehouseConstant } from '@minhdu-fontend/constants';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MainAction } from '../../states/main.action';
import { getState } from '../../../../../../libs/utils/getState.ultils';
import { selectedWareHouse } from '../../states/main.selector';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  selectWarehouse = new FormControl(getState(selectedWareHouse, this.store));
  warehouseTypeEnum = WarehouseTypeEnum;
  warehouseConstant = WarehouseConstant;
  warehouseType = getState(selectedWareHouse, this.store);

  constructor(
    private readonly store: Store
  ) {
  }

  ngOnInit() {
    this.selectWarehouse.valueChanges.subscribe(value => {
      this.store.dispatch(MainAction.updateState({warehouse: value}));
      this.warehouseType = value;
    });
  }

  import() {

  }
}
