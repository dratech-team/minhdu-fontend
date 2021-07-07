import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { selectAllCommodity } from '../+state/commodity.selector';
import { CommodityAction } from '../+state/commodity.action';
import { MatDialog } from '@angular/material/dialog';
import { CommodityDialogComponent } from '../../component/commodity-dialog/commodity-dialog.component';

@Component({
  templateUrl: 'commodity.component.html'
})
export class CommodityComponent implements OnInit {
  commodity$ = this.store.pipe(select(selectAllCommodity))
  constructor(
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog,
  ) {
  }
  ngOnInit() {
    this.store.dispatch(CommodityAction.loadInit({take: 30, skip: 0}))
  }
  add(){
    this.dialog.open(CommodityDialogComponent, {
      width: '30%',
    })
  }
  onScroll(){

  }
  deleteCommodity($event: any){

  }

}
