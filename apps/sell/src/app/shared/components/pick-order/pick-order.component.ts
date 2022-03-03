import {Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {debounceTime, tap} from 'rxjs/operators';
import {document} from 'ngx-bootstrap/utils';
import {Order} from '../../../pages/order/+state/order.interface';
import {PaidType} from 'libs/enums/paidType.enum';
import {Employee} from '@minhdu-fontend/data-models';
import {OrderAction} from '../../../pages/order/+state/order.action';
import {
  selectedTotalOrder,
  selectorAllOrders,
  selectorCurrentOrder
} from '../../../pages/order/+state/order.selector';
import {getSelectors} from '../../../../../../../libs/utils/getState.ultils';
import {selectorTotalEmployee} from '@minhdu-fontend/employee';
import {
  checkIsSelectAllInit,
  handleValSubPickItems,
  pickAll,
  pickOne,
  someComplete
} from '../../../../../../../libs/utils/pick-item.ultil';
import {Commodity} from "../../../pages/commodity/+state/commodity.interface";


@Component({
  selector: 'app-pick-order',
  templateUrl: 'pick-order.component.html',
  styleUrls: ['pick-route.component.scss']
})
export class PickOrderComponent implements OnInit, OnChanges {
  @Input() orders: Order[] = [];
  @Input() commoditiesSelected: Commodity[] = []
  @Input() pickOne = false;
  @Input() isCheckOrderSelected = false;
  @Input() orderIdDefault?: number;
  @Input() payment = false;
  @Input() orderSelected: Order[] = [];
  @Input() customerId?: number;
  @Output() checkEvent = new EventEmitter<Order[]>();
  @Output() checkCommodityEvent = new EventEmitter<Commodity[]>();
  @Output() checkEventPickOne = new EventEmitter<Order>();
  orders$ = this.store.select(selectorAllOrders);
  total$ = this.store.select(selectedTotalOrder);
  pageSize = 30;
  pageIndex = 0;
  orderPickOne!: Order;
  paidType = PaidType;
  isSelectAll = false;
  formGroup = new FormGroup(
    {
      isRoute: new FormControl(''),
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.orderSelected?.currentValue !== changes?.orderSelected?.previousValue) {
      this.isSelectAll = this.orders.every(e => this.orderSelected.some(val => val.id === e.id))
    }
  }

  ngOnInit(): void {
    this.isSelectAll = this.isCheckOrderSelected
    this.store.dispatch(OrderAction.loadInit(
      {
        orderDTO: {
          skip: this.pageIndex,
          take: this.pageSize,
          customerId: this.customerId ? this.customerId : ''
        }
      }));
    if (this.orderIdDefault) {
      this.store.select(selectorCurrentOrder(this.orderIdDefault)).subscribe(val => {
        this.orderPickOne = JSON.parse(JSON.stringify(val));
      });
    }
    if (!this.isCheckOrderSelected) {
      this.formGroup.valueChanges.pipe(
        debounceTime(1000),
        tap((_) => {
          this.eventSearch = true;
          const val = this.formGroup.value;
          this.store.dispatch(OrderAction.loadInit({orderDTO: this.order(val)}));
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
  }

  onScroll() {
    if (!this.isCheckOrderSelected) {
      this.eventSearch = false;
      const val = this.formGroup.value;
      this.store.dispatch(OrderAction.loadMoreOrders({orderDTO: this.order(val)}));
    }
  }

  order(val: any) {
    return {
      take: this.pageSize,
      skip: this.pageIndex,
      isRoute: val.isRoute,
      customerId: this.customerId ? this.customerId : '',
      customer: val.name.trim(),
      paidType: val.paidType,
      explain: val.explain.trim(),
      createdAt: val.createdAt ? new Date(val.createdAt) : '',
    };
  }

  updateAllSelect(order: Order, checkBox?: any) {
    this.isSelectAll = pickOne(order, this.orderSelected, this.orders).isSelectAll;
    if (checkBox?.checked) {
      order.commodities.forEach(val => {
        const index = this.commoditiesSelected.findIndex(commodity => commodity.id === val.id)
        if (index <= -1) {
          this.commoditiesSelected.push(val)
        }
      })
    } else {
      order.commodities.forEach(val => {
        const index = this.commoditiesSelected.findIndex(commodity => commodity.id === val.id)
        if (index > -1) {
          this.commoditiesSelected.splice(index, 1)
        }
      })
    }

    this.checkCommodityEvent.emit(this.commoditiesSelected)
    this.checkEvent.emit(this.orderSelected);
  }

  someComplete(): boolean {
    return someComplete(this.orders, this.orderSelected, this.isSelectAll);
  }

  setAll(select: boolean) {
    if (this.isCheckOrderSelected) {
      this.isSelectAll = false
      this.commoditiesSelected = []
      this.orderSelected = []
      this.checkCommodityEvent.emit(this.commoditiesSelected)
    } else {
      this.isSelectAll = select;
      pickAll(select, this.orders, this.orderSelected);
      if (select) {
        this.commoditiesSelected = []
        this.orders.forEach(val => val.commodities.map(commodity => this.commoditiesSelected.push(commodity)))
      } else {
        this.commoditiesSelected = []
      }
    }
    this.checkCommodityEvent.emit(this.commoditiesSelected)
    this.checkEvent.emit(this.orderSelected);
  }

  pickOneOrder(order: Order) {
    this.orderPickOne = order;
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

  checkCommodity(commodity: Commodity) {
    return this.commoditiesSelected.some((item) => item.id === commodity.id);
  }

  pickCommodity(commodity: Commodity, order: Order, checkbox: any) {
    const indexOrder = this.orderSelected.findIndex(val => val.id === order.id)
    if (indexOrder <= -1) {
      this.orderSelected.push(order)
    }
    const index = this.commoditiesSelected.findIndex(val => val.id === commodity.id)
    if (index > -1) {
      this.commoditiesSelected.splice(index, 1)
      if (this.commoditiesSelected.every(val => order.commodities.every(e => e.id !== val.id))) {
        this.updateAllSelect(order)
      }
    } else {
      this.commoditiesSelected.push(commodity)
    }
    this.checkCommodityEvent.emit(this.commoditiesSelected)
  }

  checkCommodityRoute(order: Order): boolean {
    return !order.commodities.every(val => typeof (val.routeId) === 'number')
  }

  getFirstRoute(order: Order): string {
    return order?.routes[0].bsx
  }
}
