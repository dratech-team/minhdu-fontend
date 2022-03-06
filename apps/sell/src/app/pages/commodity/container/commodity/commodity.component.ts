import { Component, OnInit } from '@angular/core';
import { CommodityAction } from '../../+state/commodity.action';
import { MatDialog } from '@angular/material/dialog';
import { CommodityDialogComponent } from '../../component/commodity-dialog/commodity-dialog.component';
import { CommodityUnit } from '@minhdu-fontend/enums';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { FormControl, FormGroup } from '@angular/forms';
import { Actions } from '@datorama/akita-ng-effects';
import { CommodityQuery } from '../../+state/commodity.query';

@Component({
  templateUrl: 'commodity.component.html'
})
export class CommodityComponent implements OnInit {
  commodities$ = this.commodityQuery.selectAll();

  commodityUnit = CommodityUnit;
  pageIndex = 1;
  pageSize = 30;
  formGroup = new FormGroup(
    {
      name: new FormControl(''),
      code: new FormControl(''),
      unit: new FormControl('')
    }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly commodityQuery: CommodityQuery,
    private readonly dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(CommodityAction.loadInit({ CommodityDTO: { take: 30, skip: 0 } }));
  }

  add() {
    this.dialog.open(CommodityDialogComponent, {
      width: '30%'
    });
  }

  onScroll() {
    const val = this.formGroup.value;
    this.actions$.dispatch(CommodityAction.loadMoreCommodity({ commodityDTO: this.commodity(val, this.pageSize, this.pageIndex) }));
  }

  deleteCommodity($event: any) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, { width: '25%' });
    dialogRef.afterClosed().subscribe(val => {
      if (val) {
        this.actions$.dispatch(CommodityAction.deleteCommodity({ id: $event.id }));
      }
    });
  }

  commodity(val: any, pageSize: number, pageIndex: number) {
    return {
      skip: pageSize * pageIndex++,
      take: this.pageSize
    };
  }

  UpdateCommodity($event: any) {

  }
}
