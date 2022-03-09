import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, tap } from 'rxjs/operators';
import { document } from 'ngx-bootstrap/utils';
import { OrderEntity } from '../../../pages/order/enitities/order.interface';
import { PaidType } from 'libs/enums/paidType.enum';
import { OrderActions } from '../../../pages/order/+state/order.actions';
import { checkIsSelectAllInit, handleValSubPickItems, pickAll, pickOne, someComplete } from '@minhdu-fontend/utils';
import { RouteEntity } from '../../../pages/route/entities/route.entity';
import { Actions } from '@datorama/akita-ng-effects';
import { OrderQuery } from '../../../pages/order/+state/order.query';
import { LoadOrderDto } from '../../../pages/order/dto/load-order.dto';
import {CommodityEntity} from "../../../pages/commodity/entities/commodity.entity";


@Component({
  selector: 'app-pick-order',
  templateUrl: 'pick-order.component.html',
  styleUrls: ['pick-route.component.scss']
})
export class PickOrderComponent implements OnInit, OnChanges {
  @Input() orders: OrderEntity[] = [];
  @Input() commoditiesSelected: CommodityEntity[] = [];
  @Input() pickOne = false;
  @Input() isCheckOrderSelected = false;
  @Input() orderIdDefault?: number;
  @Input() payment = false;
  @Input() orderSelected: OrderEntity[] = [];
  @Input() customerId?: number;
  @Output() checkEvent = new EventEmitter<OrderEntity[]>();
  @Output() checkCommodityEvent = new EventEmitter<CommodityEntity[]>();
  @Output() checkEventPickOne = new EventEmitter<OrderEntity>();

  orders$ = this.orderQuery.selectAll();
  total$ = this.orderQuery.selectCount();

  ordersFilter: OrderEntity[] = [];
  pageSize = 30;
  pageIndex = 0;
  orderPickOne!: OrderEntity;
  paidType = PaidType;
  isSelectAll = false;
  formGroup = new FormGroup(
    {
      hasRoute: new FormControl(''),
      name: new FormControl(''),
      createdAt: new FormControl(''),
      paidType: new FormControl(''),
      explain: new FormControl('')
    });
  eventSearch = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly actions$: Actions,
    private readonly orderQuery: OrderQuery,
    private readonly dialog: MatDialog,
    private dialogRef: MatDialogRef<PickOrderComponent>
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.orderSelected?.currentValue !== changes?.orderSelected?.previousValue) {
      this.isSelectAll = this.ordersFilter.every(e => this.orderSelected.some(val => val.id === e.id));
    }
  }

  ngOnInit(): void {
    this.isSelectAll = this.isCheckOrderSelected;
    this.actions$.dispatch(OrderActions.loadAll({
      skip: this.pageIndex,
      take: this.pageSize,
      customerId: this.customerId
    }));
    if (this.orderIdDefault) {
      this.orderQuery.selectEntity(this.orderIdDefault).subscribe(val => {
        this.orderPickOne = JSON.parse(JSON.stringify(val));
      });
    }
    if (!this.isCheckOrderSelected) {
      this.formGroup.valueChanges.pipe(
        debounceTime(1000),
        tap((_) => {
          this.eventSearch = true;
          const val = this.formGroup.value;
          this.actions$.dispatch(OrderActions.loadAll(this.order(val)));
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
        this.orders.map(val => {
            if (this.checkCommodityRoute(val)) {
              this.ordersFilter.push(val);
              console.log(this.ordersFilter);
            }
          }
        );
      });
    }
  }

  onScroll() {
    if (!this.isCheckOrderSelected) {
      this.eventSearch = false;
      const val = this.formGroup.value;
      this.actions$.dispatch(OrderActions.loadAll(this.order(val)));
    }
  }

  order(val: any): LoadOrderDto {
    return {
      take: this.pageSize,
      skip: this.pageIndex,
      hasRoute: val.hasRoute,
      customerId: this.customerId,
      customer: val.name.trim(),
      explain: val.explain.trim(),
      createdAt: val.createdAt ? new Date(val.createdAt) : ''
    };
  }

  updateAllSelect(order: OrderEntity, checkBox?: any) {
    this.isSelectAll = pickOne(order, this.orderSelected, this.ordersFilter).isSelectAll;
    if (checkBox?.checked) {
      order.commodities.forEach(val => {
        const index = this.commoditiesSelected.findIndex(commodity => commodity.id === val.id);
        if (index <= -1 && val.routeId === null) {
          this.commoditiesSelected.push(val);
        }
      });
    } else {
      order.commodities.forEach(val => {
        const index = this.commoditiesSelected.findIndex(commodity => commodity.id === val.id);
        if (index > -1 && val.routeId === null) {
          this.commoditiesSelected.splice(index, 1);
        }
      });
    }

    this.checkCommodityEvent.emit(this.commoditiesSelected);
    this.checkEvent.emit(this.orderSelected);
  }

  someComplete(): boolean {
    return someComplete(this.ordersFilter, this.orderSelected, this.isSelectAll);
  }

  setAll(select: boolean) {
    if (this.isCheckOrderSelected) {
      this.isSelectAll = false;
      this.commoditiesSelected = [];
      this.orderSelected = [];
      this.checkCommodityEvent.emit(this.commoditiesSelected);
    } else {
      this.isSelectAll = select;
      pickAll(select, this.ordersFilter, this.orderSelected);
      if (select) {
        this.commoditiesSelected = [];
        this.ordersFilter.forEach(val => val.commodities.map(commodity => {
            if (commodity.routeId === null) {
              this.commoditiesSelected.push(commodity);
            }
          }
        ));
      } else {
        this.commoditiesSelected = [];
      }
    }
    this.checkCommodityEvent.emit(this.commoditiesSelected);
    this.checkEvent.emit(this.orderSelected);
  }

  pickOneOrder(order: OrderEntity) {
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

  checkOrder(order: OrderEntity) {
    return this.orderSelected.some((item) => item.id === order.id);
  }

  checkCommodity(commodity: CommodityEntity) {
    return this.commoditiesSelected.some((item) => item.id === commodity.id);
  }

  pickCommodity(commodity: CommodityEntity, order: OrderEntity, checkbox: any) {
    const indexOrder = this.orderSelected.findIndex(val => val.id === order.id);
    if (indexOrder <= -1) {
      this.orderSelected.push(order);
    }
    const index = this.commoditiesSelected.findIndex(val => val.id === commodity.id);
    if (index > -1) {
      this.commoditiesSelected.splice(index, 1);
      if (this.commoditiesSelected.every(val => order.commodities.every(e => e.id !== val.id))) {
        this.updateAllSelect(order);
      }
    } else {
      this.commoditiesSelected.push(commodity);
    }
    this.checkEvent.emit(this.orderSelected);
    this.checkCommodityEvent.emit(this.commoditiesSelected);
  }

  checkCommodityRoute(order: OrderEntity): boolean {
    return order.commodities.some(val => val.routeId === null);
  }

  getFirstRoute(order: OrderEntity): RouteEntity {
    return order?.routes[0];
  }

}
