import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { CommodityAction } from '../../+state/commodity.action';
import { MatDialog } from '@angular/material/dialog';
import { CommodityDialogComponent } from '../../component/commodity-dialog/commodity-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { CommodityQuery } from '../../+state/commodity.query';
import {CommodityEntity} from "../../entities/commodities/commodity.entity";

@Component({
  templateUrl:'detail-commodity.component.html'
})
export class DetailCommodityComponent implements OnInit{
  commodity$ = this.commodityQuery.selectEntity(this.getId);

  constructor(
    private readonly store: Store<AppState>,
    private readonly commodityQuery: CommodityQuery,
    private readonly dialog: MatDialog,
    private readonly activatedRoute: ActivatedRoute
  ) {
  }
  ngOnInit() {
    this.store.dispatch(CommodityAction.getOne({id: this.getId}))

  }
  updateCommodity(commodity: CommodityEntity){
    this.dialog.open(CommodityDialogComponent, {
      width: '30%',
      data: commodity
    })
  }
  get getId(): number {
    return this.activatedRoute.snapshot.params.id;
  }
}
