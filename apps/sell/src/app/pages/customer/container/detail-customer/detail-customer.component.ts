import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DevelopmentComponent } from '@minhdu-fontend/components';
import { ConvertBoolean, PaidType, StatusOrder } from '@minhdu-fontend/enums';
import { CustomerActions, CustomerQuery, CustomerStore } from '../../+state';
import { CustomerEntity } from '../../entities';
import { CustomerModalComponent, PaymentModalComponent } from '../../component';
import { Actions } from '@datorama/akita-ng-effects';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OrderDialogComponent } from '../../../order/component';
import { OrderEntity } from '../../../order/enitities/order.entity';
import { ModalCustomerData } from '../../data/modal-customer.data';
import { ModalAddOrUpdatePayment } from '../../data/modal-payment.data';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: 'detail-customer.component.html',
  styleUrls: ['detail-customer.component.scss']
})
export class DetailCustomerComponent implements OnInit, OnDestroy {
  subject = new Subject<void>();
  customer$ = this.customerQuery.selectEntity(this.getId);
  delivered$ = this.customerQuery.selectDelivered(this.getId);
  delivering$ = this.customerQuery.selectDelivering(this.getId);
  deliveringLoading$ = this.customerQuery.select(
    (state) => state.deliveringLoading
  );
  deliveredLoading$ = this.customerQuery.select(
    (state) => state.deliveredLoading
  );

  convertBoolean = ConvertBoolean;
  paidType = PaidType;
  orders: OrderEntity[] = [];

  get getId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService,
    private readonly customerStore: CustomerStore,
    private readonly customerQuery: CustomerQuery
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(CustomerActions.loadOne({ id: this.getId }));
    this.actions$.dispatch(
      CustomerActions.loadOrder({
        search: { take: 20, skip: 0, customerId: +this.getId },
        typeOrder: 'delivering'
      })
    );
    this.actions$.dispatch(
      CustomerActions.loadOrder({
        search: {
          take: 20,
          skip: 0,
          customerId: +this.getId,
          hiddenDebt: StatusOrder.ALL
        },
        typeOrder: 'delivered'
      })
    );

    this.activatedRoute.queryParams.subscribe((param) => {
      if (param.isUpdate === 'true') {
        const customer = this.customerQuery.getEntity(this.getId);
        if (this.getId && customer) {
          this.onUpdate(customer);
        }
      }
    });
  }

  onAddOrder() {
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

  onUpdate(customer: CustomerEntity) {
    this.modal.create({
      nzWidth: '65vw',
      nzTitle: 'Sửa khách hàng',
      nzContent: CustomerModalComponent,
      nzComponentParams: <{ data?: ModalCustomerData }>{
        data: { update: { customer } }
      },
      nzFooter: []
    });
  }

  onRemove(customer: CustomerEntity) {
    this.modal.create({
      nzTitle: 'Xoá khách hàng',
      nzContent: `Bạn có chắc chắn muốn xoá khách hàng ${customer.lastName} ra khỏi danh sách? Điều này sẽ làm mất đi toàn bộ dữ liệu về khách hàng này, vì vậy bạn hãy cân nhắc trước khi thực hiện nhé!!!`,
      nzOnOk: () => {
        this.actions$.dispatch(CustomerActions.remove({ id: customer.id }));
        this.customerQuery.select().pipe(takeUntil(this.subject)).subscribe((state) => {
          if (!state.error && !state.loading) {
            this.router.navigate(['khach-hang']).then();
          }
        });
      }
    });
  }

  onPayment(customer: CustomerEntity) {
    this.modal
      .create({
        nzWidth: '70vw',
        nzTitle: 'Thanh toán',
        nzContent: PaymentModalComponent,
        nzComponentParams: <{ data: ModalAddOrUpdatePayment }>{
          data: {
            add: {
              customer: customer
            }
          }
        },
        nzFooter: []
      })
      .afterClose.subscribe((val) => {
      if (val) {
        this.actions$.dispatch(CustomerActions.loadOne({ id: this.getId }));
      }
    });
  }

  development() {
    this.dialog.open(DevelopmentComponent, { width: '25%' });
  }

  ngOnDestroy() {
    this.subject.next();
    this.subject.complete();
  }
}
