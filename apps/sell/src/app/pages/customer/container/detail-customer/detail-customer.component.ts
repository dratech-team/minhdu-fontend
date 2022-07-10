import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DevelopmentComponent } from '@minhdu-fontend/components';
import { ConvertBoolean, PaidType, StatusOrder } from '@minhdu-fontend/enums';
import { CustomerActions, CustomerQuery, CustomerStore } from '../../+state';
import { Actions } from '@datorama/akita-ng-effects';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OrderDialogComponent } from '../../../order/component';
import { OrderEntity } from '../../../order/enitities/order.entity';
import { CustomerComponentService } from '../../shared';

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
    public readonly customerComponentService: CustomerComponentService,
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
}
