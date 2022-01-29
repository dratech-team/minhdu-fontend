import { Component, OnInit } from '@angular/core';
import { WarehouseTypeEnum } from '@minhdu-fontend/enums';
import { WarehouseConstant } from '@minhdu-fontend/constants';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MainAction } from '../../states/main.action';
import { selectedWareHouse } from '../../states/main.selector';
import { getSelectors } from '../../../../../../libs/utils/getState.ultils';
import { MatDialog } from '@angular/material/dialog';
import { MedicineDialogComponent } from '../../container/dashboard/medicine/components/medicine-dialog/medicine-dialog.component';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  selectWarehouse = new FormControl(getSelectors(selectedWareHouse, this.store));
  warehouseTypeEnum = WarehouseTypeEnum;
  warehouseConstant = WarehouseConstant;
  warehouseType = getSelectors(selectedWareHouse, this.store);

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.selectWarehouse.valueChanges.subscribe(value => {
      this.store.dispatch(MainAction.updateState({ warehouse: value }));
      this.warehouseType = value;
    });
  }

  import() {
    this.dialog.open(MedicineDialogComponent);
  }
}
