import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, tap } from 'rxjs/operators';
import { document } from 'ngx-bootstrap/utils';
import { Order } from '../../../pages/order/+state/order.interface';
import { PaidType } from 'libs/enums/paidType.enum';
import { Employee } from '@minhdu-fontend/data-models';
import { OrderAction } from '../../../pages/order/+state/order.action';
import { selectedTotalOrder, selectorAllOrders } from '../../../pages/order/+state/order.selector';
import { getSelectors } from '../../../../../../../libs/utils/getState.ultils';
import { selectorTotalEmployee } from '@minhdu-fontend/employee';
import {
  checkIsSelectAllInit,
  handleValSubPickItems,
  pickAll,
  pickOne,
  someComplete
} from '../../../../../../../libs/utils/pick-item.ultil';


@Component({
  selector: 'app-pick-order',
  templateUrl: 'pick-order.component.html',
  styleUrls: ['pick-route.component.scss']
})
export class PickOrderComponent implements OnInit {
  @Input() pickOne = false;
  @Input() orderDefault?: Order;
  @Input() payment = false;
  @Input() orderSelected: Order[] = [];
  @Input() customerId?: number;
  @Output() checkEvent = new EventEmitter<Order[]>();
  @Output() checkEventPickOne = new EventEmitter<Order>();
  orders$ = this.store.select(selectorAllOrders);
  total$ = this.store.select(selectedTotalOrder);
  orders: Order[] = [];
  pageSize = 30;
  pageIndex = 0;
  orderPickOne!: Order;
  paidType = PaidType;
  isSelectAll = false;
  formGroup = new FormGroup(
    {
      name: new FormControl(''),
      createdAt: new FormControl(''),
      paidType: new FormControl(''),
      explain: new FormControl('')
    });
  eventSearch = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private dialogRef: MatDialogRef<PickOrderComponent>
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(OrderAction.loadInit(
      {
        orderDTO: {
          skip: this.pageIndex,
          take: this.pageSize,
          customerId: this.customerId ? this.customerId : ''
        }
      }));

    if (this.orderDefault) {
      this.orderPickOne = this.orderDefault;
    }

    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((_) => {
        this.eventSearch = true;
        const val = this.formGroup.value;
        this.store.dispatch(OrderAction.loadInit({ orderDTO: this.order(val) }));
      })
    ).subscribe();

    this.orders$.subscribe(orders => {
      if (orders.length === 0) {
        this.isSelectAll = false;
      }
      if (this.eventSearch) {
        this.isSelectAll = checkIsSelectAllInit(orders, this.orderSelected);
      }
      this.orders = handleValSubPickItems(orders, this.orders, this.orderSelected, this.isSelectAll);
    });
  }

  onScroll() {
    this.eventSearch = false;
    const val = this.formGroup.value;
    this.store.dispatch(OrderAction.loadMoreOrders({ orderDTO: this.order(val) }));
  }


  order(val: any) {
    return {
      take: this.pageSize,
      skip: this.pageIndex,
      customerId: this.customerId ? this.customerId : '',
      customer: val.name.trim(),
      paidType: val.paidType,
      explain: val.explain.trim(),
      createdAt: new Date(val.createdAt)
    };
  }


  updateAllSelect(order: Order) {
    this.isSelectAll = pickOne(order, this.orderSelected, this.orders).isSelectAll;
    this.checkEvent.emit(this.orderSelected);
  }

  someComplete(): boolean {
    return someComplete(this.orders, this.orderSelected, this.isSelectAll);
  }

  setAll(select: boolean) {
    this.isSelectAll = select;
    pickAll(select, this.orders, this.orderSelected);
    this.checkEvent.emit(this.orderSelected);
  }

  pickOneOrder() {
    const pickOrder = document.getElementsByName('pick-one');
    for (let i = 0; i < pickOrder.length; i++) {
      if (pickOrder[i].checked) {
        this.orderPickOne = pickOrder[i].value;
      }
    }
    this.checkEventPickOne.emit(this.orderPickOne);
  }

  closeDialog() {
    //case: pick one
    const pickOrder = document.getElementsByName('pick-one');
    for (let i = 0; i < pickOrder.length; i++) {
      if (pickOrder[i].checked) {
        this.orderPickOne = pickOrder[i].value;
      }
    }
    //case: pick multiple
    this.dialogRef.close(this.orderPickOne);
  }

  checkOrder(order: Order) {
    return this.orderSelected.some((item) => item.id === order.id);
  }
}
