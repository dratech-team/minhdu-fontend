import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DevelopmentComponent } from '@minhdu-fontend/components';
import { CustomerActions, CustomerQuery, CustomerStore } from '../../state';
import { Actions } from '@datorama/akita-ng-effects';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OrderDialogComponent } from '../../../order/component';
import { BaseOrderEntity, OrderEntity } from '../../../order/enitities';
import { CustomerComponentService } from '../../shared';
import { OrderListComponent } from '../../component/order-list/order-list.component';

@Component({
  templateUrl: 'detail-customer.component.html',
  styleUrls: ['detail-customer.component.scss']
})
export class DetailCustomerComponent implements OnInit {
  customer$ = this.customerQuery.selectEntity(this.getId);

  orders: OrderEntity[] = [];

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

  public onFullScreenOrder(orders: BaseOrderEntity[]): void {
    this.modal.create({
      nzWidth: 'fit-content',
      nzMask: false,
      nzCentered: true,
      nzContent: OrderListComponent,
      nzComponentParams: {
        orders: orders,
        delivered: false
      },
      nzFooter: null
    });
  }
}
