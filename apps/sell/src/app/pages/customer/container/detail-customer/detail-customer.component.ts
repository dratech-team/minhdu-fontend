import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DevelopmentComponent } from '@minhdu-fontend/components';
import { CustomerActions, CustomerQuery, CustomerStore } from '../../state';
import { Actions } from '@datorama/akita-ng-effects';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OrderDialogComponent } from '../../../order/component';
import { BaseOrderEntity } from '../../../order/enitities';
import { CustomerComponentService } from '../../shared';
import { OrderListComponent } from '../../component/order-list/order-list.component';
import { SearchOrderDto } from '../../dto';
import { omit } from 'lodash';

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

  public onOrderChanged(event: SearchOrderDto, delivered: boolean): void {
    let search = {
      startedAt_start: event.search.ranges?.length === 2 ? event.search.ranges[0] : null,
      startedAt_end: event.search.ranges?.length === 2 ? event.search.ranges[1] : null,
      province: event.search?.ward || '',
      explain: event.search?.explain || '',
      customerId: this.getId,
    };
    this.actions$.dispatch(CustomerActions.loadOrder({
      search: (!search?.startedAt_start || !search?.startedAt_end) ? omit(search, ['startedAt_start', 'startedAt_end']) : search,
      isSet: !event.isLoadMore,
      typeOrder: delivered ? 'delivered' : 'delivering'
    }));
  }

  public onFullScreenOrder(orders: BaseOrderEntity[], delivered: boolean): void {
    this.modal.create({
      nzWidth: 'fit-content',
      nzMask: false,
      nzCentered: true,
      nzContent: OrderListComponent,
      nzComponentParams: {
        orders: orders,
        delivered: delivered
      },
      nzFooter: null
    });
  }
}
