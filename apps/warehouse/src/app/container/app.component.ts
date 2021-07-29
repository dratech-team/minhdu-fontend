import { Component, OnInit } from '@angular/core';
import { WarehouseTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { selectorAllWarehouses } from '../shared/warehouse/+state/warehouse/warehouse.selector';
import { WarehouseAction } from '../shared/warehouse/+state/warehouse/warehouse.action';
import { AppState } from '../reducers';

@Component({
  selector: 'app-wareHouse',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  wareHouse$ = this.store.pipe(select(selectorAllWarehouses))
  warehouseTypeEnum = WarehouseTypeEnum;
  constructor(
    private readonly store: Store<AppState>,
  ) {
  }
  ngOnInit() {
    this.store.dispatch(WarehouseAction.LoadInit())
  }
}
