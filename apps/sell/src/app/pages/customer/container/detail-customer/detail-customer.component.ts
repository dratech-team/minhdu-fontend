import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DevelopmentComponent, DialogDeleteComponent } from '@minhdu-fontend/components';
import { ConvertBoolean, PaidType, StatusOrder } from '@minhdu-fontend/enums';
import { CustomerActions, CustomerQuery } from '../../+state';
import { CustomerEntity } from '../../entities';
import { CustomerModalComponent, PaymentModalComponent } from '../../component';
import { Actions } from '@datorama/akita-ng-effects';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OrderDialogComponent } from '../../../order/component';
import { OrderEntity } from '../../../order/enitities/order.entity';
import { ModalCustomerData } from '../../data/modal-customer.data';
import { ModalAddOrUpdatePayment } from '../../data/modal-payment.data';

@Component({
  templateUrl: 'detail-customer.component.html',
  styleUrls: ['detail-customer.component.scss']
})
export class DetailCustomerComponent implements OnInit {
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
    private readonly actions$: Actions,
    private readonly customerQuery: CustomerQuery,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService
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

  onRemove(id: any) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '25%'
    });
    dialogRef.afterClosed().subscribe((val) => {
      if (val) {
        this.actions$.dispatch(CustomerActions.remove({ id: id }));
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
}
