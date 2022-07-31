import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerActions, CustomerQuery, CustomerStore } from '../../state';
import { Actions } from '@datorama/akita-ng-effects';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OrderDialogComponent } from '../../../order/component';
import { OrderEntity } from '../../../order/enitities';
import { CustomerComponentService } from '../../shared';
import { OrderService } from '../../../order/service';
import { PaymentModalComponent } from '../../../payment/components';
import { CustomerEntity } from '../../entities';
import { PaymentService } from '../../../payment/services/payment.Service';
import { arrayAdd, arrayRemove, arrayUpdate } from '@datorama/akita';
import { BaseSearchOrderDto } from '../../../order/dto';
import { OrderListData, OrderListFormType } from '../../data';
import { catchError, take, tap } from 'rxjs/operators';
import { OrderTypeEnum } from '../../enums';
import {
  DialogDatePickerComponent
} from '../../../../../../../../libs/components/src/lib/dialog-datepicker/dialog-datepicker.component';
import { RichTextComponent } from '../../../../../../../../libs/components/src/lib/rich-text/rich-text.component';
import { GenderTypeEnum } from '@minhdu-fontend/enums';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as dateFns from 'date-fns';
import { CustomerService } from '../../service';
import { of } from 'rxjs';

@Component({
  templateUrl: 'detail-customer.component.html',
  styleUrls: ['detail-customer.component.scss']
})
export class DetailCustomerComponent implements OnInit {
  loading$ = this.customerQuery.selectLoading();
  customer$ = this.customerQuery.selectEntity(this.getId);

  isSyncDebt = false;
  fullScreen: OrderTypeEnum | null | 'payment' = null;

  GenderTypeEnum = GenderTypeEnum;
  OrderTypeEnum = OrderTypeEnum;

  orderLoading = (type: OrderTypeEnum) => {
    const state = this.customerQuery.getValue();
    if (type === OrderTypeEnum.DELIVERING) {
      return state.deliveringLoading;
    } else if (type === OrderTypeEnum.DELIVERED) {
      return state.deliveredLoading;
    }
    return state.cancelledLoading;
  };

  get getId(): number {
    return +this.activatedRoute.snapshot.params.id;
  }

  constructor(
    public readonly customerComponentService: CustomerComponentService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly actions$: Actions,
    private readonly modal: NzModalService,
    private readonly message: NzMessageService,
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
    private readonly customerService: CustomerService,
    private readonly customerStore: CustomerStore,
    private readonly customerQuery: CustomerQuery
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(CustomerActions.loadOne({ id: this.getId }));
  }

  development() {
    this.message.warning('Chức năng đang phát triển');
  }

  public onSyncDebt(customer: CustomerEntity) {
    this.isSyncDebt = true;
    this.customerService.syncDebt(customer.id)
      .pipe(
        take(1),
        tap((customer) => {
          this.customerStore.update(customer.id, { debt: customer.debt });
          this.isSyncDebt = false;
          this.message.success('Đã cập nhật dư nợ mới nhất !!');
        }),
        catchError((err) => {
          this.isSyncDebt = false;
          return of(err);
        })
      )
      .subscribe();
  }

  public calculatorAge(datetime: Date) {
    return dateFns.intervalToDuration({ start: new Date(), end: new Date(datetime) }).years;
  }

  public onAddOrder() {
    this.modal.create({
      nzTitle: 'Thêm đơn hàng',
      nzContent: OrderDialogComponent,
      nzWidth: '80vw',
      nzFooter: [],
      nzComponentParams: {
        data: {
          customerId: this.getId
        }
      }
    });
  }

  public onOrderChanged(event: OrderListData, type: OrderTypeEnum): void {
    this.actions$.dispatch(CustomerActions.loadOrder({
      search: this.mapToSearchOrder(event.search),
      isSet: !event.isLoadMore,
      orderType: type
    }));
  }

  public onPayment(customer: CustomerEntity, order?: OrderEntity) {
    this.modal.create({
      nzWidth: 'fit-content',
      nzCentered: true,
      nzContent: PaymentModalComponent,
      nzComponentParams: {
        data: { add: { order, customer: order?.customer || customer } }
      },
      nzFooter: null
    }).afterClose.subscribe((result) => {
      if (result) {
        this.paymentService.addOne({
          body: {
            ...result,
            customerId: customer.id,
            orderId: order?.id || result.orderId
          }
        })
          .subscribe((res) => {
            this.customerStore.update(customer.id, (customer) => {
              const paymentTotal = customer.delivering.concat(customer.delivered).concat(customer.cancelled)
                .filter(o => o.id === res.orderId)
                .reduce((acc, cur) => acc + cur.paymentTotal, 0);

              return {
                debt: (customer.debt || 0) + res.total,
                delivering: arrayUpdate(customer.delivering, res.orderId, { paymentTotal: paymentTotal + res.total }),
                delivered: arrayUpdate(customer.delivered, res.orderId, { paymentTotal: paymentTotal + res.total }),
                cancelled: arrayUpdate(customer.cancelled, res.orderId, { paymentTotal: paymentTotal + res.total })
              };
            });
          });
      }
    });
  }

  public onDelivered(order: OrderEntity) {
    this.modal.create({
      nzCentered: true,
      nzContent: DialogDatePickerComponent,
      nzFooter: null
    }).afterClose.subscribe(res => {
      if (res) {
        this.orderService.update(order.id, { deliveredAt: res.date })
          .pipe(take(1))
          .subscribe((res) => {
            if (res && this.getId) {
              this.customerStore.update(this.getId, (entity) => ({
                delivering: arrayRemove(entity.delivering, order.id),
                delivered: arrayAdd(entity.delivered, res)
              }));
            }
          });
      }
    });
  }

  public onCancelOrRestoreOrder(order: OrderEntity, type: 'cancel' | 'restore') {
    this.modal.create({
      nzCentered: true,
      nzTitle: `${type === 'cancel' ? 'Huỷ' : 'Khôi phục'} đơn hàng`,
      nzContent: RichTextComponent,
      nzComponentParams: { description: `Bạn có chắc chắn muốn ${type === 'cancel' ? 'huỷ' : 'khôi phục'} đơn hàng của khách hàng ${order.customer.lastName} đang được giao đến ${order.province.name}?` },
      nzOnOk: (res) => {
        if (type === 'cancel') {
          this.orderService.cancel(order.id, { reason: res.formGroup.value.reason })
            .pipe(take(1))
            .subscribe(res => {
              if (res && this.getId) {
                this.customerStore.update(this.getId, (entity) => ({
                  delivering: arrayRemove(entity.delivering, order.id),
                  cancelled: arrayAdd(entity.cancelled, { ...order, cancelledAt: res.cancelledAt, reason: res.reason })
                }));
              }
            });
        } else {
          this.orderService.restore(order.id)
            .pipe(take(1))
            .subscribe(res => {
              if (res && this.getId) {
                this.customerStore.update(this.getId, (entity) => ({
                  delivering: arrayAdd(entity.delivering, res),
                  delivered: arrayRemove(entity.delivered
                    , order.id),
                  cancelled: arrayRemove(entity.cancelled, order.id)
                }));
              }
            });
        }
      }
    });
  }

  public onHideOrder(order: OrderEntity) {
    this.orderService.hide(order.id, { hide: !order.hide })
      .pipe(take(1))
      .subscribe((res) => {
        if (res && this.getId) {
          this.customerStore.update(this.getId, (customer) => ({
            delivered: arrayUpdate(customer.delivered, order.id, res)
          }));
        }
      });
  }

  public onFullScreenOrder(type: OrderTypeEnum | null | 'payment'): void {
    this.fullScreen = type;
  }

  public onFullScreenExit(): void {
    this.fullScreen = null;
  }

  private mapToSearchOrder(data: Partial<OrderListFormType>) {
    let newSearch: Partial<BaseSearchOrderDto> = {
      province: data.province || '',
      customerId: this.getId,
      hiddenDebt: data.hiddenDebt
    };

    if (data.createdAt?.length === 2) {
      newSearch = {
        ...newSearch,
        startedAt_start: data.createdAt[0],
        startedAt_end: data.createdAt[1]
      };
    }

    if (data.deliveredAt?.length === 2) {
      newSearch = {
        ...newSearch,
        deliveredAt_start: data.deliveredAt[0],
        deliveredAt_end: data.deliveredAt[1]
      };
    }
    return newSearch;
  }
}
