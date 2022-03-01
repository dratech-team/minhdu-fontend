import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommodityUnit, CustomerType } from '@minhdu-fontend/enums';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { debounceTime } from 'rxjs/operators';
import { CommodityAction } from '../../../pages/commodity/+state/commodity.action';
import { Commodity } from '../../../pages/commodity/entities/commodity.entity';
import { CommodityDialogComponent } from '../../../pages/commodity/component/commodity-dialog/commodity-dialog.component';
import { CommodityQuery } from '../../../pages/commodity/+state/commodity.query';
import { Actions } from '@datorama/akita-ng-effects';
import { CommodityStore } from '../../../pages/commodity/+state/commodity.store';
import * as _ from 'lodash';

@Component({
  selector: 'app-pick-commodity',
  templateUrl: 'pick-commodity.component.html'
})
export class PickCommodityComponent implements OnInit {
  @Input() pickPOne: boolean | undefined;
  @Output() checkEvent = new EventEmitter<Commodity[]>();

  commodities$ = this.commodityQuery.selectAll();
  total$ = this.commodityQuery.selectCount();

  commodityUnit = CommodityUnit;
  customerType = CustomerType;
  pageIndex = 0;
  pageSize = 30;

  formGroup = new FormGroup({
    code: new FormControl(''),
    name: new FormControl(''),
    unit: new FormControl('')
  });

  constructor(
    private readonly actions$: Actions,
    private readonly commodityQuery: CommodityQuery,
    private readonly commodityStore: CommodityStore,
    private readonly dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { ids: number[], type: 'DIALOG' },
    private dialogRef: MatDialogRef<PickCommodityComponent>
  ) {
    console.log(this.data)
  }

  ngOnInit(): void {
    this.actions$.dispatch(
      CommodityAction.loadInit({ CommodityDTO: { take: this.pageSize, skip: this.pageIndex } })
    );

    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe((val) => {
      this.actions$.dispatch(
        CommodityAction.loadMoreCommodity({ commodityDTO: this.commodity(val) })
      );
    });
  }

  commodity(val: any) {
    return {
      take: this.pageSize,
      skip: this.pageIndex,
      name: val.name,
      code: val.code,
      unit: val.unit
    };
  }

  addCommodity() {
    this.dialog.open(CommodityDialogComponent, { width: '40%' });
  }

  deleteCommodity($event: any) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'fit-content'
    });
    dialogRef.afterClosed().subscribe((val) => {
      if (val) {
        this.actions$.dispatch(CommodityAction.deleteCommodity({ id: $event.id }));
      }
    });
  }

  updateCommodity(commodity: Commodity) {
    this.dialog.open(CommodityDialogComponent, {
      width: '40%',
      data: { commodity }
    });
  }

  onIndeterminate() {
    const length = this.commodityQuery.getAll().length;
    return this.data.ids.length !== 0 && length !== this.data.ids.length;
  }

  onCheck(commodity: Commodity, checked: boolean) {
    if (checked) {
      this.data.ids.push(commodity.id);
      console.log('===', this.data.ids);
    } else {
      const index = this.data.ids.indexOf(commodity.id);
      if (index > -1) {
        this.data.ids.splice(index, 1);
      }
    }
  }

  setAll(checked: boolean) {
    if (checked) {
      if (this.data?.ids) {
        this.data.ids = this.commodityQuery.getAll().map(commodity => commodity.id);
      }
    } else {
      this.data.ids = [];
    }
  }

  isAll() {
    return this.data.ids.length === this.commodityQuery.getAll().length;
  }

  onScroll() {
    const val = this.formGroup.value;
    this.actions$.dispatch(
      CommodityAction.loadMoreCommodity({ commodityDTO: this.commodity(val) })
    );
  }

  closeDialog() {
    this.dialogRef.close(this.data.ids);
  }
}
