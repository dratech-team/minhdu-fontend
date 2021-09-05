import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';

import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, tap } from 'rxjs/operators';
import { document } from 'ngx-bootstrap/utils';
import { Order } from '../../../pages/order/+state/order.interface';
import { PickOrderService } from './pick-order.service';
import { PaidType } from 'libs/enums/paidType.enum';


@Component({
  selector:'app-pick-order',
  templateUrl:'pick-order.component.html',
  styleUrls:['pick-route.component.scss']
})
export class PickOrderComponent implements OnInit{
  @Input() pickOne = false;
  @Input() payment = false;
  @Input() orders!: Order[];
  @Input() orderIdsOfRoute!: number[];
  @Input() customerId!: number
  @Output() checkEvent = new EventEmitter<number[]>();
  @Output() checkEventPickOne = new EventEmitter<number>();
  orderId!: number;
  paidType = PaidType;
  pageIndex = 1;
  pageSize = 30;
  isSelectAll = false;
  orderIds: number[] = [];
  formGroup = new FormGroup(
    {
      name: new FormControl(''),
      // createdAt: new FormControl(''),
      paidType: new FormControl(''),

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
    if(this.orderIdsOfRoute){
      this.orderIds = this.orderIdsOfRoute;
    }
    if(this?.data?.orders$){
      this.data.orders$.subscribe(
        (val: Order[]) => this.orders = val
      )
    }
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((value) => {
        const val = this.formGroup.value
        this.service.searchOrder(this.order(val, 30, 0))
        this.assignIsSelect()
      })
    ).subscribe();
  }

  onScroll() {
    const val = this.formGroup.value
    this.service.scrollOrder(this.order(val,this.pageSize, this.pageIndex))
    this.assignIsSelect()
  }
  order(val: any, pageSize: number, pageIndex: number){
    return{
      take: pageSize,
      skip: pageSize * pageIndex++,
      customerId: this?.customerId,
      customer: val.name.trim(),
      paidType: val.paidType,

    }
  }
  assignIsSelect(){
    this.service.getOrders().subscribe(val=> {
      this.orders = JSON.parse(JSON.stringify(val))
      this.orders.forEach(val => {
        if(this.orderIds.includes(val.id)){
          Object.assign(val, {isSelect: true})
        }else{
          Object.assign(val, {isSelect: this.isSelectAll})
        }
      })
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
