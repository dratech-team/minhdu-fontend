import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormGroup } from '@angular/forms';
import { PaidType } from 'libs/enums/paidType.enum';
import { OrderActions, OrderQuery } from '../../../pages/order/state';
import { getFirstDayInMonth, getLastDayInMonth } from '@minhdu-fontend/utils';
import { Actions } from '@datorama/akita-ng-effects';
import { CommodityEntity } from '../../../pages/commodity/entities';
import { OrderEntity } from '../../../pages/order/enitities';
import { ModeEnum, SortTypeOrderEnum } from '@minhdu-fontend/enums';
import { AccountQuery } from '../../../../../../../libs/system/src/lib/state/account-management/account.query';
import { RouterConstants } from '../../constants';
import * as _ from 'lodash';
import { debounceTime, startWith } from 'rxjs/operators';
import { BaseSearchOrderDto } from '../../../pages/order/dto';

@Component({
  selector: 'select-order',
  templateUrl: 'select-order.component.html',
  styleUrls: ['select-order.component.scss']
})
export class SelectOrderComponent implements OnInit {
  @Input() formGroup!: UntypedFormGroup;
  @Input() selectOne = false;
  @Input() search?: BaseSearchOrderDto;

  account$ = this.accountQuery.selectCurrentUser();
  total$ = this.orderQuery.selectCount();
  remain$ = this.orderQuery.select(state => state.remain);
  loading$ = this.orderQuery.select((state) => state.loading);

  orders: OrderEntity[] = [];
  checked = true;
  indeterminate = false;
  orderSelected = new Set<OrderEntity>();
  commoditySelected = new Set<CommodityEntity>();

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
  }

  ngOnInit(): void {
    this.orderQuery.selectAll().subscribe((val) => {
      this.orders = JSON.parse(JSON.stringify(val));
    });
    this.formGroup.value.orders?.map((item: OrderEntity) => {
      this.orderSelected.add(item);
    });
    this.formGroupTable.valueChanges
      .pipe(debounceTime(500), startWith(this.formGroupTable.value))
      .subscribe((_) => {
        this.actions$.dispatch(
          OrderActions.loadAll({
            search: this.mapOrder(this.formGroupTable.value),
            isSet: true
          })
        );
      });
  }

  onLoadMore() {
    this.actions$.dispatch(
      OrderActions.loadAll({
        search: this.mapOrder(this.formGroupTable.value),
        isSet: false
      })
    );
  }

  pickOneOrder(order: OrderEntity) {
    this.formGroup.get('order')?.setValue(order);
  }

  isOrderSelected(order: OrderEntity): boolean {
    return order.commodities.every(commodity => commodity.routeId !== null);
  }

  updateCheckedSet(order: OrderEntity, checked: boolean): void {
    if (checked) {
      if (this.selectOne) {
        this.orderSelected.clear();
        this.orderSelected.add(order);
      } else {
        this.orderSelected.add(order);
        order.commodities.map((item) => {
          if (!item.route && !this.commoditySelected.has(item)) {
            this.commoditySelected.add(item);
          }
        });
      }
    } else {
      order.commodities.map((item) => {
        if (this.commoditySelected.has(item)) {
          this.commoditySelected.delete(item);
        }
      });
      this.orderSelected.delete(order);
    }
    this.formGroup.get('orders')?.setValue(Array.from(this.orderSelected));
    this.formGroup
      .get('commodities')
      ?.setValue(Array.from(this.commoditySelected));
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
      this.orderSelected.has(order)
    );
    this.indeterminate =
      this.orders.some((order) => this.orderSelected.has(order)) &&
      !this.checked;
  }

  onItemCheckedCommodity(commodity: any, order: OrderEntity, checked: boolean) {
    if (checked) {
      if (!this.orderSelected.has(order)) {
        this.orderSelected.add(order);
      }
      this.commoditySelected.add(commodity);
    } else {
      this.commoditySelected.delete(commodity);
      const all = order.commodities.every((item) => !this.commoditySelected.has(item));
      if (all) {
        this.orderSelected.delete(order);
      }
    }
    this.formGroup.get('orders')?.setValue(Array.from(this.orderSelected));
    this.formGroup
      .get('commodities')
      ?.setValue(Array.from(this.commoditySelected));
    this.refreshCheckedStatus();
  }

  checkOrderSelect(order: OrderEntity): boolean {
    return Array.from(this.orderSelected).some((e) => e.id === order.id) && this.isOrderSelected(order);
  }

  commodityTotal = (commodities: CommodityEntity[]) => {
    return commodities.reduce((acc, cur) => {
      return acc + (cur.amount || 0) + (cur.more?.amount || 0) + (cur.gift || 0);
    }, 0);
  };

  private mapOrder(val: any) {
    val = {
      ...this.search,
      paidType: val.paidType || '',
      filterRoute: val.filterRoute || '',
      search: val.search || '',
      explain: val.explain || '',
      startedAt_start: val.startedAt[0],
      startedAt_end: val.startedAt[1],
      status: -1
    };
    if (val && !(val.startedAt_start && val.startedAt_end)) {
      val = _.omit(val, ['startedAt_start', 'startedAt_end']);
    }
    return val;
  }
}
