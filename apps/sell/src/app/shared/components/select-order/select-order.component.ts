import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormGroup } from '@angular/forms';
import { PaidType } from 'libs/enums/paidType.enum';
import { OrderActions, OrderQuery } from '../../../pages/order/state';
import { getFirstDayInMonth, getLastDayInMonth } from '@minhdu-fontend/utils';
import { Actions } from '@datorama/akita-ng-effects';
import { CommodityEntity } from '../../../pages/commodity/entities';
import { OrderEntity } from '../../../pages/order/enitities/order.entity';
import { ModeEnum, SortTypeOrderEnum } from '@minhdu-fontend/enums';
import { AccountQuery } from '../../../../../../../libs/system/src/lib/state/account-management/account.query';
import { RouterConstants } from '../../constants';
import * as _ from 'lodash';
import { debounceTime, startWith } from 'rxjs/operators';

@Component({
  selector: 'select-order',
  templateUrl: 'select-order.component.html',
  styleUrls: ['select-order.component.scss']
})
export class SelectOrderComponent implements OnInit {
  @Input() columns!: SortTypeOrderEnum[];
  @Input() formGroup!: UntypedFormGroup;
  @Input() pickOne = false;
  @Input() customerId?: number;

  account$ = this.accountQuery.selectCurrentUser();
  total$ = this.orderQuery.selectCount();
  remain$ = this.orderQuery.select(state => state.remain);
  loading$ = this.orderQuery.select((state) => state.loading);

  orders: OrderEntity[] = [];
  checked = true;
  indeterminate = false;
  setOfCheckedOrder = new Set<OrderEntity>();
  setOfCheckedCommodity = new Set<CommodityEntity>();

  RouterConstants = RouterConstants;
  ModeEnum = ModeEnum;
  PaidType = PaidType;
  SortTypeOrderEnum = SortTypeOrderEnum;

  formGroupTable = new FormGroup({
    filterRoute: new FormControl<boolean>(false),
    search: new FormControl<string>(''),
    startedAt: new FormControl<Date[] | null>([
      getFirstDayInMonth(new Date()),
      getLastDayInMonth(new Date())
    ]),
    paidType: new FormControl<PaidType | string>(''),
    explain: new FormControl<string>('')
  });

  constructor(
    private readonly actions$: Actions,
    private readonly orderQuery: OrderQuery,
    private readonly accountQuery: AccountQuery
  ) {
    this.orderQuery.selectAll().subscribe((val) => {
      this.orders = JSON.parse(JSON.stringify(val));
    });
  }

  ngOnInit(): void {
    this.formGroup.value.orders?.map((item: OrderEntity) => {
      this.setOfCheckedOrder.add(item);
    });
    this.formGroupTable.valueChanges
      .pipe(debounceTime(500), startWith(this.formGroupTable.value))
      .subscribe((_) => {
        this.actions$.dispatch(
          OrderActions.loadAll({
            search: this.mapOrder(this.formGroupTable.value),
            isPaginate: false
          })
        );
      });
  }

  onLoadMore() {
    this.actions$.dispatch(
      OrderActions.loadAll({
        search: this.mapOrder(this.formGroupTable.value),
        isPaginate: true
      })
    );
  }

  pickOneOrder(order: OrderEntity) {
    this.formGroup.get('order')?.setValue(order);
  }

  isOrderSelected(order: OrderEntity): boolean {
    return order.commodities.some(commodity => commodity.orderId);
  }

  isOrderSelectedAll(): boolean {
    return this.setOfCheckedOrder.size === this.orderQuery.getCount();
  }

  updateCheckedSet(order: OrderEntity, checked: boolean): void {
    if (checked) {
      if (this.pickOne) {
        this.setOfCheckedOrder.clear();
        this.setOfCheckedOrder.add(order);
      } else {
        this.setOfCheckedOrder.add(order);
        order.commodities.map((item) => {
          if (!item.route && !this.setOfCheckedCommodity.has(item)) {
            this.setOfCheckedCommodity.add(item);
          }
        });
      }
    } else {
      order.commodities.map((item) => {
        if (this.setOfCheckedCommodity.has(item)) {
          this.setOfCheckedCommodity.delete(item);
        }
      });
      this.setOfCheckedOrder.delete(order);
    }
    this.formGroup.get('orders')?.setValue(Array.from(this.setOfCheckedOrder));
    this.formGroup
      .get('commodities')
      ?.setValue(Array.from(this.setOfCheckedCommodity));
  }

  onAllChecked(checked: boolean) {
    this.orders.forEach((order) => this.updateCheckedSet(order, checked));
    this.refreshCheckedStatus();
  }

  onItemChecked(order: OrderEntity, checked: boolean): void {
    this.updateCheckedSet(order, checked);
    this.refreshCheckedStatus();
  }

  private refreshCheckedStatus(): void {
    this.checked = this.orders.every((order) =>
      this.setOfCheckedOrder.has(order)
    );
    this.indeterminate =
      this.orders.some((order) => this.setOfCheckedOrder.has(order)) &&
      !this.checked;
  }

  private mapOrder(val: any) {
    val = {
      paidType: val.paidType || '',
      filterRoute: val.filterRoute || '',
      search: val.search || '',
      explain: val.explain || '',
      startedAt_start: val.startedAt[0],
      startedAt_end: val.startedAt[1]
    };
    if (val && !(val.startedAt_start && val.startedAt_end)) {
      val = _.omit(val, ['startedAt_start', 'startedAt_end']);
    }
    return Object.assign(
      {},
      val,
      this.customerId ? { customerId: this.customerId } : {}
    );
  }

  onItemCheckedCommodity(commodity: any, order: OrderEntity, checked: boolean) {
    if (checked) {
      if (!this.setOfCheckedOrder.has(order)) {
        this.setOfCheckedOrder.add(order);
      }
      this.setOfCheckedCommodity.add(commodity);
    } else {
      this.setOfCheckedCommodity.delete(commodity);
      const all = order.commodities.every((item) => !this.setOfCheckedCommodity.has(item));
      if (all) {
        this.setOfCheckedOrder.delete(order);
      }
    }
    this.formGroup.get('orders')?.setValue(Array.from(this.setOfCheckedOrder));
    this.formGroup
      .get('commodities')
      ?.setValue(Array.from(this.setOfCheckedCommodity));
    this.refreshCheckedStatus();
  }

  checkOrderSelect(order: OrderEntity): boolean {
    return Array.from(this.setOfCheckedOrder).some((e) => e.id === order.id) && this.isOrderSelected(order);
  }
}
