import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { selectAllCommodity } from '../+state/commodity.selector';
import { CommodityAction } from '../+state/commodity.action';
import { Commodity } from '../+state/commodity.interface';
import { Customer } from '../../../customer/+state/customer.interface';
import { MatDialog } from '@angular/material/dialog';
import { CommodityDialogComponent } from '../../component/commodity-dialog/commodity-dialog.component';

@Component({
  templateUrl:'detail-commodity.component.html'
})
export class DetailCommodityComponent implements OnInit{
  commodity!:Commodity
  // commodity$ = this.store.pipe(select(selectAllCommodity))
  constructor(
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog
  ) {
  }
  ngOnInit() {
    // this.store.dispatch(CommodityAction.getCommodity({id:1}))
  }
  updateCommodity(commodity: Commodity){
    this.dialog.open(CommodityDialogComponent, {
      width: '30%',
      data: commodity
    })
  }
}
