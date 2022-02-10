import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MainAction } from '../../states/main.action';
import { selectedWareHouse } from '../../states/main.selector';
import { getSelectors } from '@minhdu-fontend/utils';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from '../../container/dashboard/medicine/components/product-dialog/product-dialog.component';
import { DashboardService } from './dashboard.service';
import { OrgchartActions } from '@minhdu-fontend/orgchart';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  selectWarehouse = new FormControl(getSelectors(selectedWareHouse, this.store));
  warehouse$ = this.service.getAll();

  constructor(
    private readonly store: Store,
    private readonly service: DashboardService,
    private readonly dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.selectWarehouse.valueChanges.subscribe(value => {
      this.store.dispatch(MainAction.updateState({ warehouse: value }));
    });
  }

  import() {
    this.dialog.open(ProductDialogComponent);
  }
}
