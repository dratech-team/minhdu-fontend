import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { CommodityAction } from '../../+state/commodity.action';
import { Commodity } from '../../entities/commodity.entity';
import { MatDialog } from '@angular/material/dialog';
import { CommodityDialogComponent } from '../../component/commodity-dialog/commodity-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { CommodityQuery } from '../../+state/commodity.query';
import { Actions } from '@datorama/akita-ng-effects';

@Component({
  templateUrl: 'detail-commodity.component.html'
})
export class DetailCommodityComponent implements OnInit {
  commodity$ = this.commodityQuery.selectEntity(this.getId);

  constructor(
    private readonly actions$: Actions,
    private readonly commodityQuery: CommodityQuery,
    private readonly dialog: MatDialog,
    private readonly activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(CommodityAction.getCommodity({ id: this.getId }));

  }

  updateCommodity(commodity: Commodity) {
    this.dialog.open(CommodityDialogComponent, {
      width: '30%',
      data: commodity
    });
  }

  get getId(): number {
    return this.activatedRoute.snapshot.params.id;
  }
}
