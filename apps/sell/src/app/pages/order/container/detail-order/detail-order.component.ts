import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommodityUnit, ModeEnum, PaymentType } from '@minhdu-fontend/enums';
import { OrderActions, OrderQuery, OrderStore } from '../../state';
import { MatDialog } from '@angular/material/dialog';
import { CommodityAction } from '../../../commodity/state';
import { CommodityDialogComponent } from '../../../commodity/component';
import { OrderHistoryService } from '../../service';
import { UntypedFormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Actions } from '@datorama/akita-ng-effects';
import { OrderHistoryEntity } from '../../enitities';
import { CommodityEntity } from '../../../commodity/entities';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AccountQuery } from '../../../../../../../../libs/system/src/lib/state/account-management/account.query';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrderComponentService } from '../../shared';
import { arrayRemove } from '@datorama/akita';

@Component({
  templateUrl: 'detail-order.component.html'
})
export class DetailOrderComponent implements OnInit {
  order$ = this.orderQuery.selectEntity(this.getOrderId);
  loading$ = new BehaviorSubject<boolean>(false);
  account$ = this.accountQuery.selectCurrentUser();

  ModeEnum = ModeEnum;
  PaymentType = PaymentType;
  CommodityUnit = CommodityUnit;

  constructor(
    public readonly orderComponentService: OrderComponentService,
    private readonly actions$: Actions,
    private readonly activatedRoute: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly orderHistoryService: OrderHistoryService,
    private readonly modal: NzModalService,
    private readonly message: NzMessageService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly orderQuery: OrderQuery,
    private readonly accountQuery: AccountQuery,
    private readonly orderStore: OrderStore
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(OrderActions.loadOne({ id: this.getOrderId }));

    this.activatedRoute.queryParams.subscribe((param) => {
      if (param.isUpdate === 'true') {
        const order = this.orderQuery.getEntity(this.getOrderId);
        if (order) {
          this.orderComponentService.onUpdate(order, 'GENERAL');
        }
      }
    });
  }

  get getOrderId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  public onUpdateCommodity(orderId: number, commodity: CommodityEntity) {
    this.modal.create({
      nzTitle: 'Cập nhật hàng hoá',
      nzContent: CommodityDialogComponent,
      nzComponentParams: {
        data: { commodity, isUpdate: true }
      },
      nzFooter: []
    });
  }

  public onRemoveCommodity(commodity: CommodityEntity) {
    this.modal.warning({
      nzTitle: 'Xoá đơn hàng',
      nzContent: `Bạn có chắc chắn muốn xoá hàng hoá ${commodity.name}?`,
      nzOnOk: () => {
        if (commodity.orderId) {
          this.actions$.dispatch(
            CommodityAction.remove({
              id: commodity.id,
              inOrder: { orderId: commodity.orderId }
            })
          );
        }
      }
    });
  }

  public closingCommodity(commodity: CommodityEntity, orderId: number) {
    const closedText = commodity.closed ? 'Bỏ Chốt ' : 'Chốt ';
    this.modal.warning({
      nzTitle: 'Chốt hàng hoá',
      nzContent: `Bạn có chắc chắn muốn ${closedText + commodity.name}`,
      nzCancelText: `${closedText}`,
      nzOkText: `${closedText} và lưu lịch sử`,
      nzOnCancel: () => {
        this.actions$.dispatch(
          CommodityAction.update({
            id: commodity.id,
            updates: {
              logged: false,
              orderId: orderId,
              closed: !commodity.closed
            }
          })
        );
      },
      nzOnOk: () => {
        this.actions$.dispatch(
          CommodityAction.update({
            id: commodity.id,
            updates: {
              logged: true,
              orderId: orderId,
              closed: !commodity.closed
            }
          })
        );
      }
    });
  }

  public onRoute(id: number) {
    this.router.navigate(['khach-hang/chi-tiet-khach-hang', id]).then();
  }

  public onRemoveOrderHistory(orderHistory: OrderHistoryEntity) {
    this.modal.create({
      nzTitle: 'Xoá lịch sử chốt đơn',
      nzContent: `Bạn có chắc chắn chắn muốn xoá mục lịch sử này không?`,
      nzOnOk: () => {
        this.orderHistoryService.delete(orderHistory.id).subscribe(() => {
          this.orderStore.update(this.getOrderId, ({ orderHistories }) => ({
            orderHistories: arrayRemove(orderHistories, orderHistory.id)
          }));
        });
      }
    });
  }
}
