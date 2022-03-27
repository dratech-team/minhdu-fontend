import { Component, OnInit } from '@angular/core';
import { RouteEntity } from '../../entities/route.entity';
import { MatDialog } from '@angular/material/dialog';
import { RouteDialogComponent } from '../../component/route-dialog/route-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteAction } from '../../+state/route.action';
import { PaymentType } from '@minhdu-fontend/enums';
import { DialogDatePickerComponent } from '../../../../../../../../libs/components/src/lib/dialog-datepicker/dialog-datepicker.component';
import { DialogSharedComponent } from '../../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component';
import { OrderEntity } from '../../../order/enitities/order.entity';
import { Actions } from '@datorama/akita-ng-effects';
import { RouteQuery } from '../../+state/route.query';
import { CancelEnum } from '../../enums/cancel.enum';
import { CommodityEntity } from '../../../commodity/entities/commodity.entity';
import { OrderActions } from '../../../order/+state/order.actions';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  templateUrl: 'detail-route.component.html'
})
export class DetailRouteComponent implements OnInit {
  payType = PaymentType;

  route$ = this.routeQuery.selectEntity(this.routeId);
  route = {} as RouteEntity;

  constructor(
    private readonly actions$: Actions,
    private readonly routeQuery: RouteQuery,
    private readonly dialog: MatDialog,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly modal: NzModalService
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(RouteAction.loadOne({ id: this.routeId }));
    this.route$.subscribe(val => {
      if (val) {
        this.route = JSON.parse(JSON.stringify(val));
      }
    });

    this.activatedRoute.queryParams.subscribe(param => {
      if (param.isUpdate === 'true') {
        const route = this.routeQuery.getEntity(this.routeId);
        if (route) {
          this.updateRoute(route);
        }
      }
    });
  }

  updateRoute(route: RouteEntity, selectOrder?: boolean) {
    this.modal.create({
      nzWidth: 'fit-content',
      nzTitle: 'Cập nhật tuyến đường',
      nzContent: RouteDialogComponent,
      nzComponentParams: {
        data: { route: route, selectOrder: selectOrder, isUpdate: true }
      },
      nzFooter: null
    });
  }

  get routeId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  detailOrder(orderId: number) {
    this.router.navigate(['don-hang/chi-tiet-don-hang', orderId]).then();
  }

  completeRoute(route: RouteEntity) {
    this.dialog.open(DialogDatePickerComponent, {
      width: 'fit-content',
      data: {
        titlePopup: 'Hoàn tất tuyến đường',
        title: 'Ngày hoàn tất',
        dayInit: route.endedAt
      }
    }).afterClosed()
      .subscribe(val => {
        if (val) {
          this.actions$.dispatch(
            RouteAction.update({ updates: { endedAt: val.day }, id: route.id })
          );
        }
      });
  }

  cancelCommodity(commodity: CommodityEntity) {
    this.dialog.open(DialogSharedComponent, {
      width: 'fit-content',
      data: {
        title: 'Huỷ hàng hoá trong tuyến đường',
        description: `Bạn có chắc chắn Huỷ ${commodity.name}`
      }
    }).afterClosed()
      .subscribe(val => {
        if (val) {
          this.actions$.dispatch(RouteAction.cancel({
            id: this.route.id,
            cancelDTO: { desId: commodity.id, cancelType: CancelEnum.COMMODITY }
          }));
        }
      });
  }

  cancelOrder(order: OrderEntity) {
    this.dialog.open(DialogSharedComponent, {
      width: 'fit-content',
      data: {
        title: 'Huỷ đơn hàng trong tuyến đường',
        description: 'Bạn có chắc chắn uỷ đơn hàng này'
      }
    }).afterClosed()
      .subscribe(val => {
        if (val) {
          this.actions$.dispatch(RouteAction.cancel({
            id: this.route.id,
            cancelDTO: { desId: order.id, cancelType: CancelEnum.ORDER }
          }));
        }
      });
  }

  addCommodityInRoute(commodity: CommodityEntity) {
    this.dialog.open(DialogSharedComponent, {
      width: 'fit-content',
      data: {
        title: 'Thêm hàng hoá cho tuyến đương',
        description: `Bạn có muốn thêm ${commodity.name} cho tuyến đường ${this.route.name} `
      }
    }).afterClosed()
      .subscribe(val => {
        if (val) {
          this.actions$.dispatch(RouteAction.update({ id: this.route.id, updates: { commodityIds: [commodity.id] } }));
        }
      });
  }

  updateOrder(order: OrderEntity) {
    this.dialog.open(DialogDatePickerComponent, {
      width: 'fit-content',
      data: {
        titlePopup: 'Xác nhận giao hàng',
        title: 'Ngày giao hàng'
      }
    }).afterClosed().subscribe(val => {
      if (val) {
        this.actions$.dispatch(OrderActions.update({
          id: order.id,
          updates: {
            deliveredAt: val.day
          },
          inRoute: { routeId: this.routeId }
        }));
      }
    });
  }
}
