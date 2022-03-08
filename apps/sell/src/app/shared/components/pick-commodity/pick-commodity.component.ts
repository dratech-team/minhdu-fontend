import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CommodityUnit, CustomerType} from '@minhdu-fontend/enums';
import {DialogDeleteComponent} from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import {debounceTime} from 'rxjs/operators';
import {checkIsSelectAllInit, handleValSubPickItems, pickAll, pickOne, someComplete} from '@minhdu-fontend/utils';
import {CommodityAction} from '../../../pages/commodity/+state/commodity.action';
import {CommodityDialogComponent} from '../../../pages/commodity/component/commodity-dialog/commodity-dialog.component';
import {CommodityQuery} from '../../../pages/commodity/+state/commodity.query';
import {Actions} from '@datorama/akita-ng-effects';
import {CommodityEntity} from "../../../pages/commodity/entities/commodity.entity";

@Component({
  selector: 'app-pick-commodity',
  templateUrl: 'pick-commodity.component.html'
})
export class PickCommodityComponent implements OnInit {
  commodities: CommodityEntity[] = [];
  commodityUnit = CommodityUnit;
  @Input() commoditiesSelected: CommodityEntity[] = [];
  @Input() pickPOne: boolean | undefined;
  @Output() checkEvent = new EventEmitter<CommodityEntity[]>();
  customerType = CustomerType;
  pageIndex = 0;
  pageSize = 30;
  isEventSearch = true;
  isSelectAll = false;

  commodities$ = this.commodityQuery.selectAll();
  total$ = this.commodityQuery.selectCount();
  formGroup = new FormGroup({
    code: new FormControl(''),
    name: new FormControl(''),
    unit: new FormControl('')
  });

  constructor(
    private readonly actions$: Actions,
    private readonly commodityQuery: CommodityQuery,
    private readonly dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PickCommodityComponent>,
  ) {
  }

  ngOnInit(): void {
    if (this.data?.commoditiesPicked) {
      this.commoditiesSelected = [...this.data?.commoditiesPicked];
    }
    // this.store.select(selectedCommodityNewAdd).subscribe((val) => {
    //   if (val) {
    //     this.commoditiesSelected.push(val);
    //   }
    // });

    this.actions$.dispatch(
      CommodityAction.loadAll({take: this.pageSize, skip: this.pageIndex})
    );
    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe((val) => {
      this.isEventSearch = true;
      this.actions$.dispatch(
        CommodityAction.loadAll(this.commodity(val))
      );
    });

    this.commodities$.subscribe((commodities) => {
      if (commodities.length === 0) {
        this.isSelectAll = false;
      }
      if (this.isEventSearch) {
        this.isSelectAll = checkIsSelectAllInit(
          commodities,
          this.commoditiesSelected
        );
      }
      this.commodities = handleValSubPickItems(
        commodities,
        this.commodities,
        this.commoditiesSelected,
        this.isSelectAll
      );
    });
  }

  commodity(val: any) {
    return {
      take: this.pageSize,
      skip: this.commodityQuery.getCount(),
      name: val.name,
      code: val.code,
      unit: val.unit
    };
  }

  addCommodity() {
    this.dialog.open(CommodityDialogComponent, {width: '40%'}).afterClosed().subscribe(val => {
      console.log('====', val);
    });
  }

  deleteCommodity($event: any) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'fit-content'
    });
    dialogRef.afterClosed().subscribe((val) => {
      if (val) {
        this.actions$.dispatch(CommodityAction.remove({id: $event.id}));
      }
    });
  }

  updateCommodity(commodity: CommodityEntity) {
    this.dialog.open(CommodityDialogComponent, {
      width: '40%',
      data: {commodity}
    });
  }

  updateAllSelect(commodity: CommodityEntity) {
    this.isSelectAll = pickOne(
      commodity,
      this.commoditiesSelected,
      this.commodities
    ).isSelectAll;
    this.checkEvent.emit(this.commoditiesSelected);
  }

  someComplete(): boolean {
    return someComplete(
      this.commodities,
      this.commoditiesSelected,
      this.isSelectAll
    );
  }

  setAll(select: boolean) {
    this.isSelectAll = select;
    pickAll(select, this.commodities, this.commoditiesSelected);
    this.checkEvent.emit(this.commoditiesSelected);
  }

  onScroll() {
    this.isEventSearch = false;
    const val = this.formGroup.value;
    this.actions$.dispatch(
      CommodityAction.loadAll(this.commodity(val))
    );
  }

  closeDialog() {
    this.actions$.dispatch(CommodityAction.resetStateCommodityNewAdd());
    this.dialogRef.close(this.commoditiesSelected);
  }

  checkedCommodity(commodity: CommodityEntity) {
    return this.commoditiesSelected.some((item) => item.id === commodity.id);
  }
}
