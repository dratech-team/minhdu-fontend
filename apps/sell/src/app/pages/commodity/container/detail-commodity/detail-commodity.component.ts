import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import {  selectorCurrentCommodity } from '../../+state/commodity.selector';
import { CommodityAction } from '../../+state/commodity.action';
import { Commodity } from '../../+state/commodity.interface';
import { MatDialog } from '@angular/material/dialog';
import { CommodityDialogComponent } from '../../component/commodity-dialog/commodity-dialog.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl:'detail-commodity.component.html'
})
export class DetailCommodityComponent implements OnInit{
  commodity$ = this.store.pipe(select(selectorCurrentCommodity(this.getId)))
  constructor(
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog,
    private readonly activatedRoute: ActivatedRoute
  ) {
  }
  ngOnInit() {
    this.store.dispatch(CommodityAction.getCommodity({id: this.getId}))

  }
  updateCommodity(commodity: Commodity){
    this.dialog.open(CommodityDialogComponent, {
      width: '30%',
      data: commodity
    })
  }
  get getId(): number {
    return this.activatedRoute.snapshot.params.id;
  }
}
