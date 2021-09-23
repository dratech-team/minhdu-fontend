import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormControl, FormGroup } from '@angular/forms';
import { CommodityUnit, CustomerResource, CustomerType } from '@minhdu-fontend/enums';
import { Commodity } from '../../../pages/commodity/+state/commodity.interface';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PickCommodityService } from './pick-commodity.service';
import { CommodityDialogComponent } from '../../../pages/commodity/component/commodity-dialog/commodity-dialog.component';
import { CommodityAction } from '../../../pages/commodity/+state/commodity.action';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';

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

  formGroup = new FormGroup(
    {
      code: new FormControl(''),
      name: new FormControl(''),
      unit: new FormControl(''),
      price: new FormControl('')
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
    if (this.data.commodities$) {
      this.data.commodities$.subscribe(
        (val: any) => {
          this.commodities = JSON.parse(JSON.stringify(val));
          this.assignIsSelect();
        }
      );
    }
  }

  // onScroll() {
  //   const val = {
  //     take: this.pageSize,
  //     skip: this.pageSize * this.pageIndex
  //   };
  //   this.pageIndex++;
  //   this.service.scrollCommodities(val);
  // }

  assignIsSelect() {
    if (this.isSelectAll) {
      this.commodityIds = [];
      this.commodities.forEach(commodity => {
        commodity.isSelect = this.isSelectAll;
        this.commodityIds.push(commodity.id);
      });
    } else {
      this.commodities.forEach(e => {
        e.isSelect = this.commodityIds.includes(e.id);
      });
    }
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
    this.isSelectAll = this.commodities !== null && this.commodities.every(e => e.isSelect);
    this.checkEvent.emit(this.commodityIds);
  }

  someComplete(): boolean {
    if (this.commodities == null) {
      return false;
    }
    return (
      this.commodities.filter(e => e.isSelect).length > 0 && !this.isSelectAll
    );
  }

  setAll(select: boolean) {
    this.isSelectAll = select;
    this.commodityIds = [];
    this.commodities?.forEach(commodity => {
        commodity.isSelect = select;
        if (select) {
          this.commodityIds.push(commodity.id);
        }
      }
    );
    this.checkEvent.emit(this.commodityIds);
  }

  closeDialog() {
    this.dialogRef.close(this.commodityIds);
  }
}
