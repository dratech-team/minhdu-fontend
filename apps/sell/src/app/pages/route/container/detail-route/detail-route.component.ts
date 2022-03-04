import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../reducers';
import {Route} from '../../+state/route.interface';
import {MatDialog} from '@angular/material/dialog';
import {RouteDialogComponent} from '../../component/route-dialog/route-dialog.component';
import {selectorCurrentRoute} from '../../+state/route.selector';
import {ActivatedRoute, Router} from '@angular/router';
import {RouteAction} from '../../+state/route.action';
import {MenuEnum, PaymentType} from '@minhdu-fontend/enums';
import {MainAction} from '../../../../states/main.action';
import {getSelectors} from '@minhdu-fontend/utils';
import {
  DialogDatePickerComponent
} from "../../../../../../../../libs/components/src/lib/dialog-datepicker/dialog-datepicker.component";
import {Commodity} from "../../../commodity/+state/commodity.interface";
import {
  DialogSharedComponent
} from "../../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component";
import {Order} from "../../../order/+state/order.interface";

@Component({
  templateUrl: 'detail-route.component.html'
})
export class DetailRouteComponent implements OnInit {
  payType = PaymentType;

  route$ = this.store.select(selectorCurrentRoute(this.routeId));
  route = {} as Route

  constructor(
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    this.store.dispatch(MainAction.updateStateMenu({tab: MenuEnum.ROUTE}));
    this.store.dispatch(RouteAction.getRoute({id: this.routeId}));
    this.route$.subscribe(val => {
      if (val) {
        this.route = JSON.parse(JSON.stringify(val))
      }
    })

    this.activatedRoute.queryParams.subscribe(param => {
      if (param.isUpdate === 'true') {
        this.updateRoute(getSelectors(selectorCurrentRoute(this.routeId), this.store));
      }
    });
  }

  updateRoute(route: Route, selectOrder?: boolean) {
    this.dialog.open(RouteDialogComponent, {
      width: 'fit-content',
      data: {route: route, selectOrder: selectOrder, isUpdate: true}
    });
  }

  get routeId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  detailOrder(orderId: number) {
    this.router.navigate(['don-hang/chi-tiet-don-hang', orderId]).then();
  }

  completeRoute(route: Route) {
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
          this.store.dispatch(
            RouteAction.updateRoute({route: {endedAt: val.day}, id: route.id})
          )
        }
      })
  }

  cancelCommodity(commodity: Commodity) {
    this.dialog.open(DialogSharedComponent, {
      width: 'fit-content',
      data: {
        title: 'Huỷ hàng hoá trong tuyến đường',
        description: 'Bạn có chắc chắn Huỷ hàng hoá này',
      }
    }).afterClosed()
      .subscribe(val => {
        if (val) {
          const commodityIds: number[] = []
          this.route.orders.forEach(val => val.commodities.forEach(val => commodityIds.push(val.id)))
          const index = commodityIds.indexOf(commodity.id)
          commodityIds.splice(index, 1)
          const route = {
            commodityIds: commodityIds,
          }
          this.store.dispatch(RouteAction.updateRoute({
            id: this.route.id,
            route: route
          }))
        }
      })
  }

  cancelOrder(order: Order) {
    this.dialog.open(DialogSharedComponent, {
      width: 'fit-content',
      data: {
        title: 'Huỷ đơn hàng trong tuyến đường',
        description: 'Bạn có chắc chắn uỷ đơn hàng này',
      }
    }).afterClosed()
      .subscribe(val => {
        if (val) {
          const orderIds = this.route.orders.map(e => e.id)
          const index = orderIds.indexOf(order.id)
          orderIds.splice(index, 1)
          const route = {
            orderIds: orderIds
          }
          this.store.dispatch(RouteAction.updateRoute({
            id: this.route.id,
            route: route
          }))
        }
      })
  }
}
