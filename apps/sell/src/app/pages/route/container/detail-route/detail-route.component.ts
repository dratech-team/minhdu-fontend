import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteActions, RouteQuery, RouteStore } from '../../state';
import { ModeEnum, PaymentType } from '@minhdu-fontend/enums';
import { Actions } from '@datorama/akita-ng-effects';
import { CancelEnum, UpdaterRouteTypeEnum } from '../../enums';
import { CommodityEntity } from '../../../commodity/entities';
import { OrderActions } from '../../../order/state';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OrderEntity } from '../../../order/enitities';
import { ModalDatePickerComponent } from '@minhdu-fontend/components';
import { ModalDatePickerEntity } from '@minhdu-fontend/base-entity';
import { map } from 'rxjs/operators';
import { RouterConstants } from '../../../../shared/constants';
import { RouteComponentService } from '../../shared';
import { AccountQuery } from '../../../../../../../../libs/system/src/lib/state/account-management/account.query';
import { RouteEntity } from '../../entities';
import { arrayUpdate } from '@datorama/akita';

@Component({
  templateUrl: 'detail-route.component.html',
  styleUrls: ['detail-route.component.scss']
})
export class DetailRouteComponent implements OnInit {
  account$ = this.accountQuery.selectCurrentUser();
  loading$ = this.routeQuery.selectLoading();
  expandedAll$ = this.routeQuery.select((state) => state.expandedAll);
  route$ = this.routeQuery.selectEntity(this.routeId)
    .pipe(map(route => route && JSON.parse(JSON.stringify(route))));

  ModeEnum = ModeEnum;
  RouterConstants = RouterConstants;
  PaymentType = PaymentType;
  UpdaterRouteTypeEnum = UpdaterRouteTypeEnum;

  constructor(
    public readonly routeComponentService: RouteComponentService,
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly modal: NzModalService,
    private readonly routeQuery: RouteQuery,
    private readonly accountQuery: AccountQuery,
    private readonly routeStore: RouteStore
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
  }

  ngOnInit() {
    this.actions$.dispatch(RouteActions.loadOne({ id: this.routeId }));
  }

  get routeId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  public onExpandAll() {
    const expandedAll = this.routeQuery.getValue().expandedAll;
    const route = this.routeQuery.getEntity(this.routeId);
    if (route) {
      this.routeStore.update(route.id, ({ orders }) => ({
        orders: arrayUpdate(orders, orders.map(order => order.id), { expand: !expandedAll })
      }));
    }

    this.routeStore.update((state) => ({ ...state, expandedAll: !expandedAll }));
  }

  public onAddCommodity(commodity: CommodityEntity) {
    this.modal.info({
      nzTitle: 'Th??m h??ng ho?? cho tuy???n ???????ng',
      nzContent: `B???n c?? mu???n th??m ${commodity.name} cho tuy???n ???????ng ${this.routeQuery.getEntity(this.routeId)?.name} `,
      nzOnOk: () => {
        if (this.routeId) {
          this.actions$.dispatch(
            RouteActions.update({
              id: this.routeId,
              updates: { commodityIds: [commodity.id] }
            })
          );
        } else {
          throw Error('Do not get routeId. Please check again!!!');
        }
      }
    });
  }

  public onCompleteOrder(order: OrderEntity) {
    this.modal.create({
      nzTitle: 'X??c nh???n giao h??ng',
      nzContent: ModalDatePickerComponent,
      nzComponentParams: <{ data: ModalDatePickerEntity }>{
        data: {
          type: 'date',
          dateInit: new Date()
        }
      },
      nzFooter: []
    })
      .afterClose.subscribe((val) => {
      if (val && this.routeId) {
        this.actions$.dispatch(
          OrderActions.update({
            id: order.id,
            updates: {
              deliveredAt: new Date(val)
            },
            inRoute: { routeId: this.routeId }
          })
        );
      }
    });
  }

  public onCancelCommodity(commodity: CommodityEntity) {
    this.modal.warning({
      nzTitle: 'Hu??? h??ng ho?? trong tuy???n ???????ng',
      nzContent: `B???n c?? ch???c ch???n Hu??? ${commodity.name}`,
      nzOkDanger: true,
      nzOnOk: () => {
        if (this.routeId) {
          this.actions$.dispatch(
            RouteActions.cancel({
              id: this.routeId,
              cancelDTO: {
                desId: commodity.id,
                cancelType: CancelEnum.COMMODITY
              }
            })
          );
        }
      }
    });
  }

  public onCancelOrder(order: OrderEntity) {
    this.modal.warning({
      nzTitle: 'Hu??? ????n h??ng trong tuy???n ???????ng',
      nzContent: 'B???n c?? ch???c ch???n hu??? ????n h??ng n??y',
      nzOkDanger: true,
      nzOnOk: () => {
        if (this.routeId) {
          this.actions$.dispatch(
            RouteActions.cancel({
              id: this.routeId,
              cancelDTO: { desId: order.id, cancelType: CancelEnum.ORDER }
            })
          );
        }
      }
    });
  }

  public onRoute(id: number, type: 'ORDER' | 'ROUTE') {
    if (type === 'ORDER') {
      this.router.navigate([RouterConstants.ORDER.DETAIL, id]).then();
    } else {
      this.router.navigate([RouterConstants.ROUTE.DETAIL, id]).then();
    }
  }

  public titleTotalCommodityUniq(route: RouteEntity) {
    return `${route.commodityUniq.reduce((a, b) => a + b.amount, 0)} Con. Trong ????:
    ${route.commodityUniq.map((commodity) => commodity.amount + ' ' + commodity.code)} `;
  }
}
