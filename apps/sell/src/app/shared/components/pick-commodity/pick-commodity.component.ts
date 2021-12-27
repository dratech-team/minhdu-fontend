import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FormControl, FormGroup } from '@angular/forms';
import { CommodityUnit, CustomerResource, CustomerType } from '@minhdu-fontend/enums';
import { Commodity } from '../../../pages/commodity/+state/commodity.interface';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PickCommodityService } from './pick-commodity.service';
import { CommodityDialogComponent } from '../../../pages/commodity/component/commodity-dialog/commodity-dialog.component';
import { CommodityAction, loadInit } from '../../../pages/commodity/+state/commodity.action';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import {
  selectAllCommodity,
  selectedCommodityNewAdd,
  selectedTotalCommodity
} from '../../../pages/commodity/+state/commodity.selector';
import { EmployeeAction, selectorTotalEmployee } from '@minhdu-fontend/employee';
import { Employee } from '@minhdu-fontend/data-models';
import { debounceTime } from 'rxjs/operators';
import { getSelectors } from '../../../../../../../libs/utils/getState.ultils';
import {
  checkIsSelectAllInit,
  handleValSubPickItems, pickAll,
  pickOne,
  someComplete
} from '../../../../../../../libs/utils/pick-item.ultil';
import { objectKeys } from '@angular-eslint/eslint-plugin/dist/utils/utils';

@Component({
  selector: 'app-pick-commodity',
  templateUrl: 'pick-commodity.component.html'
})
export class PickCommodityComponent implements OnInit {
  commodities: Commodity[] = [];
  commodityUnit = CommodityUnit;
  @Input() commoditiesSelected: Commodity[] = [];
  @Input() pickPOne: boolean | undefined;
  @Output() checkEvent = new EventEmitter<Commodity[]>();
  resourceType = CustomerResource;
  customerType = CustomerType;
  pageIndex = 0;
  pageSize = 30;
  isEventSearch = true;
  isSelectAll = false;

  commodities$ = this.store.select(selectAllCommodity);
  total$ = this.store.select(selectedTotalCommodity);
  formGroup = new FormGroup(
    {
      code: new FormControl(''),
      name: new FormControl(''),
      unit: new FormControl('')
    }
  );

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PickCommodityComponent>,
    private readonly service: PickCommodityService
  ) {
  }

  ngOnInit(): void {
    if (this.data?.commoditiesPicked) {
      this.commoditiesSelected = [...this.data?.commoditiesPicked];
    }
    this.store.select(selectedCommodityNewAdd).subscribe(val => {
      if(val){
        this.commoditiesSelected.push(val)
      }
    })
    this.store.dispatch(CommodityAction.loadInit({ CommodityDTO: { take: this.pageSize, skip: this.pageIndex } }));
    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe(val => {
      this.isEventSearch = true;
      this.store.dispatch(CommodityAction.loadMoreCommodity(
        { commodityDTO: this.commodity(val) }));
    });

    this.commodities$.subscribe(commodities => {
      if (commodities.length === 0) {
        this.isSelectAll = false;
      }
      if (this.isEventSearch) {
        this.isSelectAll = checkIsSelectAllInit(commodities, this.commoditiesSelected);
      }
      this.commodities = handleValSubPickItems(commodities, this.commodities, this.commoditiesSelected, this.isSelectAll);
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
    const ref = this.dialog.open(CommodityDialogComponent, { width: '40%' });
  }

  deleteCommodity($event: any) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, { width: 'fit-content' });
    dialogRef.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(CommodityAction.deleteCommodity({ id: $event.id }));
      }
    });
  }

  UpdateCommodity($event: any) {
    this.dialog.open(CommodityDialogComponent, { width: '40%', data: $event });
  }

  updateAllSelect(commodity: Commodity) {
    this.isSelectAll = pickOne(commodity, this.commoditiesSelected, this.commodities).isSelectAll;
    this.checkEvent.emit(this.commoditiesSelected);
  }

  someComplete(): boolean {
    return someComplete(this.commodities, this.commoditiesSelected, this.isSelectAll);
  }

  setAll(select: boolean) {
    this.isSelectAll = select;
    pickAll(select, this.commodities, this.commoditiesSelected);
    this.checkEvent.emit(this.commoditiesSelected);
  }

  onScroll() {
    this.isEventSearch = false;
    const val = this.formGroup.value;
    this.store.dispatch(
      CommodityAction.loadMoreCommodity(
        { commodityDTO: this.commodity(val) })
    );
  }

  closeDialog() {
    this.store.dispatch(CommodityAction.resetStateCommodityNewAdd())
    this.dialogRef.close(this.commoditiesSelected);
  }

  checkedCommodity(commodity: Commodity) {
    return this.commoditiesSelected.some((item) => item.id === commodity.id);
  }
}
