import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DevelopmentComponent } from '@minhdu-fontend/components';
import { CustomerActions, CustomerQuery, CustomerStore } from '../../state';
import { Actions } from '@datorama/akita-ng-effects';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OrderDialogComponent } from '../../../order/component';
import { OrderEntity } from '../../../order/enitities';
import { CustomerComponentService } from '../../shared';
import { OrderListComponent } from '../../component/order-list/order-list.component';
import { OrderService } from '../../../order/service';
import { PaymentModalComponent } from '../../../payment/components';
import { CustomerEntity } from '../../entities';
import { PaymentService } from '../../../payment/services/payment.Service';
import { arrayUpdate } from '@datorama/akita';
import { BaseSearchOrderDto } from '../../../order/dto';
import { OrderListData, OrderListFormType } from '../../data/order-list.data';

@Component({
  templateUrl: 'detail-customer.component.html',
  styleUrls: ['detail-customer.component.scss']
})
export class DetailCustomerComponent implements OnInit {
  loading$ = this.customerQuery.selectLoading();
  deliveringLoading$ = this.customerQuery.select(state => state.deliveringLoading);
  deliveredLoading$ = this.customerQuery.select(state => state.deliveredLoading);
  customer$ = this.customerQuery.selectEntity(this.getId);

  get getId(): number {
    return +this.activatedRoute.snapshot.params.id;
  }

  constructor(
    public readonly customerComponentService: CustomerComponentService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService,
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
    private readonly customerStore: CustomerStore,
    private readonly customerQuery: CustomerQuery
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(CustomerActions.loadOne({ id: this.getId }));
  }

  development() {
    this.dialog.open(DevelopmentComponent, { width: '25%' });
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

  public onOrderChanged(event: OrderListData, type: 'delivering' | 'delivered' | 'cancelled'): void {
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

  public onCancelOrder(order: OrderEntity) {

  }

  public onFullScreenOrder(orders: OrderEntity[], type: 'delivered' | 'delivering' | 'cancelled'): void {
    this.modal.create({
      nzWidth: 'fit-content',
      nzMask: false,
      nzCentered: true,
      nzContent: OrderListComponent,
      nzComponentParams: {
        orders: orders,
        type: type
      },
      nzFooter: null
    });
  }

  private mapToSearchOrder(data: Partial<OrderListFormType>) {
    let newSearch: Partial<BaseSearchOrderDto> = {
      province: data.province || '',
      customerId: this.getId
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
