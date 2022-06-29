import { Component, OnInit } from '@angular/core';
import { RouteEntity } from '../../entities';
import { MatDialog } from '@angular/material/dialog';
import { RouteDialogComponent } from '../../component';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteActions, RouteQuery } from '../../+state';
import { PaymentType } from '@minhdu-fontend/enums';
import { Actions } from '@datorama/akita-ng-effects';
import { CancelEnum } from '../../enums';
import { CommodityEntity } from '../../../commodity/entities';
import { OrderActions } from '../../../order/+state';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UpdateTypeEnum } from '../../enums/update-type.enum';
import { OrderEntity } from '../../../order/enitities/order.entity';
import { ModalDatePickerComponent } from '@minhdu-fontend/components';
import { ModalDatePickerEntity } from '@minhdu-fontend/base-entity';

@Component({
  templateUrl: 'detail-route.component.html',
})
export class DetailRouteComponent implements OnInit {
  payType = PaymentType;

  route$ = this.routeQuery.selectEntity(this.routeId);
  route = {} as RouteEntity;
  updateTypeEnum = UpdateTypeEnum;

  constructor(
    private readonly actions$: Actions,
    private readonly routeQuery: RouteQuery,
    private readonly dialog: MatDialog,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly modal: NzModalService
  ) {}

  ngOnInit() {
    this.actions$.dispatch(RouteActions.loadOne({ id: this.routeId }));
    this.route$.subscribe((val) => {
      if (val) {
        this.route = JSON.parse(JSON.stringify(val));
      }
    });

    this.activatedRoute.queryParams.subscribe((param) => {
      if (param.isUpdate === 'true') {
        const route = this.routeQuery.getEntity(this.routeId);
        if (route) {
          this.updateRoute(route, UpdateTypeEnum.ALL);
        }
      }
    });
  }

  updateRoute(route: RouteEntity, updateType: UpdateTypeEnum) {
    this.modal.create({
      nzWidth: 'fit-content',
      nzTitle: 'Cập nhật tuyến đường',
      nzContent: RouteDialogComponent,
      nzComponentParams: <{ data?: any }>{
        data: { route: route, updateType: updateType, isUpdate: true },
      },
      nzFooter: [],
    });
  }

  get routeId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  detailOrder(orderId: number) {
    this.router.navigate(['don-hang/chi-tiet-don-hang', orderId]).then();
  }

  completeRoute(route: RouteEntity) {
    this.modal
      .create({
        nzTitle: 'Hoàn tất tuyến đường',
        nzContent: ModalDatePickerComponent,
        nzComponentParams: <{ data: ModalDatePickerEntity }>{
          data: {
            type: 'date',
            dateInit: route.endedAt,
          },
        },
        nzFooter: [],
      })
      .afterClose.subscribe((val) => {
        if (val) {
          this.actions$.dispatch(
            RouteActions.update({
              updates: { endedAt: new Date(val) },
              id: route.id,
            })
          );
        }
      });
  }

  cancelCommodity(commodity: CommodityEntity) {
    this.modal.warning({
      nzTitle: 'Huỷ hàng hoá trong tuyến đường',
      nzContent: `Bạn có chắc chắn Huỷ ${commodity.name}`,
      nzOkDanger: true,
      nzOnOk: () => {
        this.actions$.dispatch(
          RouteActions.cancel({
            id: this.route.id,
            cancelDTO: {
              desId: commodity.id,
              cancelType: CancelEnum.COMMODITY,
            },
          })
        );
      },
    });
  }

  cancelOrder(order: OrderEntity) {
    this.modal.warning({
      nzTitle: 'Huỷ đơn hàng trong tuyến đường',
      nzContent: 'Bạn có chắc chắn huỷ đơn hàng này',
      nzOkDanger: true,
      nzOnOk: () => {
        this.actions$.dispatch(
          RouteActions.cancel({
            id: this.route.id,
            cancelDTO: { desId: order.id, cancelType: CancelEnum.ORDER },
          })
        );
      },
    });
  }

  addCommodityInRoute(commodity: CommodityEntity) {
    this.modal.info({
      nzTitle: 'Thêm hàng hoá cho tuyến đường',
      nzContent: `Bạn có muốn thêm ${commodity.name} cho tuyến đường ${this.route.name} `,
      nzOnOk: () => {
        this.actions$.dispatch(
          RouteActions.update({
            id: this.route.id,
            updates: { commodityIds: [commodity.id] },
          })
        );
      },
    });
  }

  updateOrder(order: OrderEntity) {
    this.modal
      .create({
        nzTitle: 'Xác nhận giao hàng',
        nzContent: ModalDatePickerComponent,
        nzComponentParams: <{ data: ModalDatePickerEntity }>{
          data: {
            type: 'date',
            dateInit: new Date(),
          },
        },
        nzFooter: [],
      })
      .afterClose.subscribe((val) => {
        if (val) {
          this.actions$.dispatch(
            OrderActions.update({
              id: order.id,
              updates: {
                deliveredAt: new Date(val),
              },
              inRoute: { routeId: this.routeId },
            })
          );
        }
      });
  }

  onRemove(route: RouteEntity) {
    this.modal.warning({
      nzTitle: 'Xoá tuyến đương',
      nzContent: `Bạn có chắc chắn muốn huỷ tuyến đường ${route.name} này không`,
      nzOkDanger: true,
      nzOnOk: () => {
        this.actions$.dispatch(RouteActions.remove({ idRoute: route.id }));
        this.routeQuery
          .select((state) => state.deleted)
          .subscribe((val) => {
            if (val) {
              this.router.navigate(['tuyen-duong']).then();
            }
          });
      },
    });
  }
}
