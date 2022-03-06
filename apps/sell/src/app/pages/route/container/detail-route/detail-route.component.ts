import { Component, OnInit } from '@angular/core';
import { RouteEntity } from '../../entities/route.entity';
import { MatDialog } from '@angular/material/dialog';
import { RouteDialogComponent } from '../../component/route-dialog/route-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteActions } from '../../+state/routeActions';
import { MenuEnum, PaymentType } from '@minhdu-fontend/enums';
import { MainAction } from '../../../../states/main.action';
import { DialogDatePickerComponent } from '../../../../../../../../libs/components/src/lib/dialog-datepicker/dialog-datepicker.component';
import { Commodity } from '../../../commodity/+state/commodity.interface';
import { DialogSharedComponent } from '../../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component';
import { OrderEntity } from '../../../order/enitities/order.interface';
import { Actions } from '@datorama/akita-ng-effects';
import { RouteQuery } from '../../+state/route.query';

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
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(MainAction.updateStateMenu({ tab: MenuEnum.ROUTE }));
    this.actions$.dispatch(RouteActions.loadOne({ id: this.routeId }));
    this.route$.subscribe(val => {
      if (val) {
        this.route = JSON.parse(JSON.stringify(val));
        console.log(this.route)
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
    this.dialog.open(RouteDialogComponent, {
      width: 'fit-content',
      data: { route: route, selectOrder: selectOrder, isUpdate: true }
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
            RouteActions.update({ updates: { endedAt: val.day }, id: route.id })
          );
        }
      });
  }

  cancelCommodity(commodity: Commodity) {
    console.log(commodity.id)
    this.dialog.open(DialogSharedComponent, {
      width: 'fit-content',
      data: {
        title: 'Huỷ hàng hoá trong tuyến đường',
        description: 'Bạn có chắc chắn Huỷ hàng hoá này'
      }
    }).afterClosed()
      .subscribe(val => {
        if (val) {
          const commodityIds: number[] = [];
          this.route.orders.forEach((val:OrderEntity) => val.commodities.forEach(val => commodityIds.push(val.id)));
          const index = commodityIds.indexOf(commodity.id);
          commodityIds.splice(index, 1);
          const route = {
            commodityIds: commodityIds
          };
          this.actions$.dispatch(RouteActions.update({
            id: this.route.id,
            updates: route
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
          const orderIds = this.route.orders.map((e:OrderEntity) => e.id);
          const index = orderIds.indexOf(order.id);
          orderIds.splice(index, 1);
          const route = {
            orderIds: orderIds
          };
          this.actions$.dispatch(RouteActions.update({
            id: this.route.id,
            updates: route
          }));
        }
      });
  }
}
