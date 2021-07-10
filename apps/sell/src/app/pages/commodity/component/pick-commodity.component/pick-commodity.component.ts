import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';

import { CommodityUnit, CustomerResource, CustomerType } from '@minhdu-fontend/enums';
import { Commodity } from '../../container/+state/commodity.interface';
import { selectAllCommodity } from '../../container/+state/commodity.selector';
import { CommodityAction } from '../../container/+state/commodity.action';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector:'app-pick-commodity',
  templateUrl:'pick-commodity.component.html'
})
export class PickCommodityComponent implements OnInit{
  commodityUnit = CommodityUnit;
  @Input() pickPOne: boolean|undefined;
  @Output() checkEvent = new EventEmitter();
  resourceType = CustomerResource;
  customerType = CustomerType;
  pageIndex: number = 1;
  pageSize: number = 30;
  selectAll: boolean = false;
  commodities: Commodity[] = [];
  commodityIds: number[] = [];
  commodities$ = this.store.pipe(select(selectAllCommodity));

  formGroup = new FormGroup(
    {
      code: new FormControl(''),
      name: new FormControl(''),
      unit: new FormControl(''),
      price: new FormControl(''),
      amount: new FormControl(''),
    }
  );
  constructor(
    private readonly store: Store,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PickCommodityComponent>
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(CommodityAction.loadInit({ skip: 0, take: 30 }));
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((val) => {
        this.store.dispatch(CommodityAction.loadInit({
          skip: 0,
          take: 30,
        }));
      })
    ).subscribe()
    this.commodities$.subscribe(val =>{
      this.commodities = JSON.parse(JSON.stringify(val))
      this.commodities.map(e => e.isSelect = this.selectAll)
    });
  }

  onScroll() {
    const val = this.formGroup.value
    this.store.dispatch(CommodityAction.loadMoreCommodity({
      take: this.pageSize,
      skip: this.pageSize * this.pageIndex++,
    }));
  }


  updateAllSelect(id: number) {
    const index = this.commodityIds.indexOf(id);
    if (index > -1) {
      this.commodityIds.splice(index, 1);
    } else {
      this.commodityIds.push(id);
    }
    this.selectAll = this.commodities !== null && this.commodities.every(e => e.isSelect);
    this.checkEvent.emit(this.commodityIds);
  }

  someComplete(): boolean {
    if (this.commodities == null) {
      return false;
    }
    return (
      this.commodities.filter(e => e.isSelect).length > 0 && !this.selectAll
    );

  }

  setAll(select: boolean) {
    this.selectAll = select;
    if (this.commodities == null) {
      return;
    }
    this.commodityIds = [];
    this.commodities?.forEach(customer => {
      customer.isSelect = select;
        if (select) {
          this.commodityIds.push(customer.id);
        }
      }
    );
    this.checkEvent.emit(this.commodityIds);
  }

  close(){
      this.dialogRef.close( this.commodityIds)
  }
}
