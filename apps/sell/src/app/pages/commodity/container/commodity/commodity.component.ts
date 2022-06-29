import { Component, OnInit } from '@angular/core';
import { CommodityAction, CommodityQuery } from '../../+state';
import { MatDialog } from '@angular/material/dialog';
import { CommodityDialogComponent } from '../../component';
import { CommodityUnit } from '@minhdu-fontend/enums';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Actions } from '@datorama/akita-ng-effects';

@Component({
  templateUrl: 'commodity.component.html',
})
export class CommodityComponent implements OnInit {
  commodities$ = this.commodityQuery.selectAll();

  commodityUnit = CommodityUnit;
  pageIndex = 1;
  pageSize = 30;
  formGroup = new UntypedFormGroup({
    name: new UntypedFormControl(''),
    code: new UntypedFormControl(''),
    unit: new UntypedFormControl(''),
  });

  constructor(
    private readonly actions$: Actions,
    private readonly commodityQuery: CommodityQuery,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit() {
    this.actions$.dispatch(
      CommodityAction.loadAll({ search: { take: 30, skip: 0 } })
    );
  }

  add() {
    this.dialog.open(CommodityDialogComponent, {
      width: '30%',
    });
  }

  onScroll() {
    const val = this.formGroup.value;
    this.actions$.dispatch(
      CommodityAction.loadAll({
        search: {
          take: this.pageSize,
          skip: this.commodityQuery.getCount(),
        },
      })
    );
  }

  deleteCommodity($event: any) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, { width: '25%' });
    dialogRef.afterClosed().subscribe((val) => {
      if (val) {
        this.actions$.dispatch(CommodityAction.remove({ id: $event.id }));
      }
    });
  }

  UpdateCommodity($event: any) {}
}
