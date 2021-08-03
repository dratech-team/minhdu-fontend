import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import {  Store } from '@ngrx/store';
import { FormControl, FormGroup } from '@angular/forms';
import { CommodityUnit, CustomerResource, CustomerType } from '@minhdu-fontend/enums';
import { Commodity } from '../../../pages/commodity/+state/commodity.interface';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PickCommodityService } from './pick-commodity.service';
import { CommodityDialogComponent } from '../../../pages/commodity/component/commodity-dialog/commodity-dialog.component';

@Component({
  selector: 'app-pick-commodity',
  templateUrl: 'pick-commodity.component.html'
})
export class PickCommodityComponent implements OnInit {
  @Input() commodities: Commodity[] = []
  commodityUnit = CommodityUnit;
  @Input() pickPOne: boolean | undefined;
  @Output() checkEvent = new EventEmitter();
  resourceType = CustomerResource;
  customerType = CustomerType;
  pageIndex: number = 1;
  pageSize: number = 30;
  isSelectAll: boolean = false;

  commodityIds: number[] = [];

  formGroup = new FormGroup(
    {
      code: new FormControl(''),
      name: new FormControl(''),
      unit: new FormControl(''),
      price: new FormControl(''),
      amount: new FormControl('')
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
    if(this.data.commodities$){
      this.data.commodities$.subscribe(
        (val: any) => this.commodities = JSON.parse(JSON.stringify(val))
      )
    }
  }

  onScroll() {
    const val = {
      take: this.pageSize,
      skip: this.pageIndex++
    };
    this.service.scrollCommodities(val);
    this.assignIsSelect()
  }

  assignIsSelect(){
    this.service.commodities().subscribe(val => {
      this.commodities = JSON.parse(JSON.stringify(val));
      this.commodities.forEach(e => {
        if(this.commodityIds.includes(e.id)){
          e.isSelect = true
        }else{
          e.isSelect = this.isSelectAll
        }
      });
    });
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

  closeDialog() {
    this.dialogRef.close(this.commodityIds);
  }
  addCommodity(){
    this.dialog.open(CommodityDialogComponent,{width: '40%'})
  }
}
