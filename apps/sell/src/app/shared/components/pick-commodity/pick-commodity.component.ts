import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommodityUnit, CustomerType } from '@minhdu-fontend/enums';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { debounceTime, tap } from 'rxjs/operators';
import { CommodityAction } from '../../../pages/commodity/+state/commodity.action';
import { Commodity } from '../../../pages/commodity/entities/commodity.entity';
import { CommodityDialogComponent } from '../../../pages/commodity/component/commodity-dialog/commodity-dialog.component';
import { CommodityQuery } from '../../../pages/commodity/+state/commodity.query';
import { Actions } from '@datorama/akita-ng-effects';
import { CommodityStore } from '../../../pages/commodity/+state/commodity.store';

@Component({
  selector: 'app-pick-commodity',
  templateUrl: 'pick-commodity.component.html'
})
export class PickCommodityComponent implements OnInit {
  @Input() pickPOne: boolean | undefined;
  @Output() checkEvent = new EventEmitter<Commodity[]>();

  commodities$ = this.commodityQuery.selectAll();
  commoditiesSelected$ = this.commodityQuery.selectAll({ filterBy: [entity => entity.selected] });
  total$ = this.commodityQuery.selectCount();

  commodityUnit = CommodityUnit;
  customerType = CustomerType;
  pageIndex = 0;
  pageSize = 30;
  isEventSearch = true;
  isSelectAll = false;

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
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PickCommodityComponent>
  ) {
  }

  ngOnInit(): void {
    if (this.data?.commoditiesPicked) {
      // this.commoditiesSelected = [...this.data?.commoditiesPicked];
    }
    this.actions$.dispatch(
      CommodityAction.loadInit({ CommodityDTO: { take: this.pageSize, skip: this.pageIndex } })
    );

    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe((val) => {
      this.isEventSearch = true;
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
    const checkedLength = this.commodityQuery.getAll({ filterBy: [entity => entity.selected] }).length;
    return checkedLength !== 0 && checkedLength !== this.commodityQuery.getCount();
  }

  onCheck(commodity: Commodity, checked: boolean) {
    this.commodityStore.update(commodity.id, { selected: checked });
  }

  setAll(checked: boolean) {
    this.commodityQuery.getAll().forEach(commodity => {
      this.commodityStore.update(commodity.id, { selected: checked });
    });
  }

  onScroll() {
    this.isEventSearch = false;
    const val = this.formGroup.value;
    this.actions$.dispatch(
      CommodityAction.loadMoreCommodity({ commodityDTO: this.commodity(val) })
    );
  }

  closeDialog() {
    this.dialogRef.close(this.commodityQuery.getAll({ filterBy: [entity => entity.selected] }));
  }
}
