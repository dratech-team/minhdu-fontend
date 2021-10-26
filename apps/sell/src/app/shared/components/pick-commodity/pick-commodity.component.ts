import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FormControl, FormGroup } from '@angular/forms';
import { CommodityUnit, CustomerResource, CustomerType } from '@minhdu-fontend/enums';
import { Commodity } from '../../../pages/commodity/+state/commodity.interface';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PickCommodityService } from './pick-commodity.service';
import { CommodityDialogComponent } from '../../../pages/commodity/component/commodity-dialog/commodity-dialog.component';
import { CommodityAction } from '../../../pages/commodity/+state/commodity.action';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { selectAllCommodity } from '../../../pages/commodity/+state/commodity.selector';

@Component({
  selector: 'app-pick-commodity',
  templateUrl: 'pick-commodity.component.html'
})
export class PickCommodityComponent implements OnInit {
  @Input() commodities: Commodity[] = [];
  commodityUnit = CommodityUnit;
  @Input() pickPOne: boolean | undefined;
  @Output() checkEvent = new EventEmitter();
  resourceType = CustomerResource;
  customerType = CustomerType;
  pageIndex = 1;
  pageSize = 30;
  isSelectAll = false;
  commodityIds: number[] = [];
  commodities$ = this.store.pipe(select(selectAllCommodity));
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
    this.store.dispatch(CommodityAction.loadAllCommodities());
    this.commodities$.subscribe(commodities => {
      this.commodities = JSON.parse(JSON.stringify(commodities));
    });
  }

  // onScroll() {
  //   const val = {
  //     take: this.pageSize,
  //     skip: this.pageSize * this.pageIndex
  //   };
  //   this.pageIndex++;
  //   this.service.scrollCommodities(val);
  // }
  commodity(val: any) {
    return {
      name: val.name,
      code: val.code,
      unit: val.unit
    };
  }

  addCommodity() {
    this.dialog.open(CommodityDialogComponent, { width: '40%' });
  }

  deleteCommodity($event: any) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, { width: '35%' });
    dialogRef.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(CommodityAction.deleteCommodity({ id: $event.id }));
      }
    });
  }

  UpdateCommodity($event: any) {
    this.dialog.open(CommodityDialogComponent, { width: '40%', data: $event });
  }

  updateAllSelect(id: number) {
    const index = this.commodityIds.indexOf(id);
    if (index > -1) {
      this.commodityIds.splice(index, 1);
    } else {
      this.commodityIds.push(id);
    }
    this.isSelectAll = this.commodities !== null && this.commodities.every(e => this.commodityIds.includes(e.id));
    this.checkEvent.emit(this.commodityIds);
  }

  someComplete(): boolean {
    return (
      this.commodities.filter(e => this.commodityIds.includes(e.id)).length > 0 && !this.isSelectAll
    );
  }

  setAll(select: boolean) {
    this.isSelectAll = select;
    this.commodities?.forEach(commodity => {
        if (select) {
          if (!this.commodityIds.includes(commodity.id)) {
            this.commodityIds.push(commodity.id);
          }
        } else {
          const index = this.commodityIds.indexOf(commodity.id);
          if (index > -1) {
            this.commodityIds.splice(index, 1);
          }
        }
      }
    );
    this.checkEvent.emit(this.commodityIds);
  }

  closeDialog() {
    this.dialogRef.close(this.commodityIds);
  }
}
