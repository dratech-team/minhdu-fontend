import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteActions, RouteQuery } from '../../state';
import { PaymentType } from '@minhdu-fontend/enums';
import { Actions } from '@datorama/akita-ng-effects';
import { CancelEnum } from '../../enums';
import { CommodityEntity } from '../../../commodity/entities';
import { OrderActions } from '../../../order/state';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UpdaterRouteTypeEnum } from '../../enums/updater-route-type.enum';
import { OrderEntity } from '../../../order/enitities/order.entity';
import { ModalDatePickerComponent } from '@minhdu-fontend/components';
import { ModalDatePickerEntity } from '@minhdu-fontend/base-entity';
import { map } from 'rxjs/operators';
import { RouterConstants } from '../../../../shared/constants';
import { RouteComponentService } from '../../shared';

@Component({
  templateUrl: 'detail-route.component.html',
  styleUrls: ['detail-route.component.scss']
})
export class DetailRouteComponent implements OnInit {
  loading$ = this.routeQuery.selectLoading();
  route$ = this.routeQuery.selectEntity(this.routeId)
    .pipe(map(route => {
      if (route) {
        return JSON.parse(JSON.stringify(route));
      }
    }));

  PaymentType = PaymentType;
  UpdaterRouteTypeEnum = UpdaterRouteTypeEnum;

  constructor(
    public readonly routeComponentService: RouteComponentService,
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly routeQuery: RouteQuery,
    private readonly modal: NzModalService
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(RouteActions.loadOne({ id: this.routeId }));
  }

  get routeId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  public onAddCommodity(commodity: CommodityEntity) {
    this.modal.info({
      nzTitle: 'Thêm hàng hoá cho tuyến đường',
      nzContent: `Bạn có muốn thêm ${commodity.name} cho tuyến đường ${this.routeQuery.getEntity(this.routeId)?.name} `,
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
    this.modal
      .create({
        nzTitle: 'Xác nhận giao hàng',
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
      nzTitle: 'Huỷ hàng hoá trong tuyến đường',
      nzContent: `Bạn có chắc chắn Huỷ ${commodity.name}`,
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
      nzTitle: 'Huỷ đơn hàng trong tuyến đường',
      nzContent: 'Bạn có chắc chắn huỷ đơn hàng này',
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

  public onRoute(orderId: number) {
    this.router.navigate([RouterConstants.ORDER.DETAIL, orderId]).then();
  }
}
