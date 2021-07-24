import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';

import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, tap } from 'rxjs/operators';
import { document } from 'ngx-bootstrap/utils';
import { Order } from '../../../pages/order/+state/order.interface';
import { PickOrderService } from './pick-order.service';
import { PaidType } from '../../../../../../../libs/enums/paidType.enum';

@Component({
  selector:'app-pick-order',
  templateUrl:'pick-order.component.html'
})
export class PickOrderComponent implements OnInit{
  @Input() pickOne = false;
  @Input() orders!: Order[];
  @Output() checkEvent = new EventEmitter<number[]>();
  @Output() checkEventPickOne = new EventEmitter<number>();
  orderId!: number;
  paidType = PaidType;
  pageIndex: number = 1;
  pageSize: number = 30;
  isSelectAll: boolean = false;
  orderIds: number[] = [];
  formGroup = new FormGroup(
    {
      name: new FormControl(''),
      createdAt: new FormControl(''),
      paidType: new FormControl('')
    });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly service: PickOrderService,
    private dialogRef: MatDialogRef<PickOrderComponent>,
  ) {
  }

  ngOnInit(): void {
    if(this.data.orders$){
      this.data.orders$.subscribe(
        (val: Order[]) => this.orders = val
      )
    }
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((value) => {
        const val = this.formGroup.value
        this.service.searchOrder(this.customer(val, 30, 0))
        this.assignIsSelect()
      })
    ).subscribe();

  }

  onScroll() {
    const val = this.formGroup.value
    this.service.scrollOrder(this.customer(val,this.pageSize, this.pageIndex))
    this.assignIsSelect()
  }
  customer(val: any, pageSize: number, pageIndex: number){
    return{
      take: pageSize,
      skip: pageSize * pageIndex++,
      name: val.name,
      customerType: val.type,
      resource: val.resource
    }
  }
  assignIsSelect(){
    this.service.getOrders().subscribe(val=> {
      this.orders = JSON.parse(JSON.stringify(val))
      this.orders.forEach(e => e.isSelect = this.isSelectAll)
    })
  }

  updateAllSelect(id: number) {
    const index = this.orderIds.indexOf(id);
    if (index > -1) {
      this.orderIds.splice(index, 1);
    } else {
      this.orderIds.push(id);
    }
    this.isSelectAll = this.orders !== null && this.orders.every(e => e.isSelect);
    this.checkEvent.emit(this.orderIds);
  }

  someComplete(): boolean {
    if (this.orders == null) {
      return false;
    }
    return (
      this.orders.filter(e => e.isSelect).length > 0 && !this.isSelectAll
    );
  }

  setAll(select: boolean) {
    this.isSelectAll = select;
    if (this.orders == null) {
      return;
    }
    this.orderIds = [];
    this.orders?.forEach(order => {
      order.isSelect = select;
        if (select) {
          this.orderIds.push(order.id);
        }
      }
    );
    this.checkEvent.emit(this.orderIds);
  }

  pickOneOrder(){
    const pickOrder = document.getElementsByName('pick-one');
    for (let i = 0; i < pickOrder.length; i++) {
      if (pickOrder[i].checked) {
        this.orderId = parseInt(pickOrder[i].value);
      }
    }
    this.checkEventPickOne.emit(this.orderId);
  }

  closeDialog() {
    const pickOrder = document.getElementsByName('pick-one');
    for (let i = 0; i < pickOrder.length; i++) {
      if (pickOrder[i].checked) {
        this.orderId = parseInt(pickOrder[i].value);
      }
    }
    this.dialogRef.close(this.orderId);
  }
}
