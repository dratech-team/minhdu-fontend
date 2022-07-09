import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommodityUnit, ModeEnum, PaymentType } from '@minhdu-fontend/enums';
import { OrderActions, OrderQuery } from '../../+state';
import { OrderDialogComponent } from '../../component';
import { MatDialog } from '@angular/material/dialog';
import { CommodityAction } from '../../../commodity/state';
import { CommodityDialogComponent } from '../../../commodity/component';
import { OrderHistoryService } from '../../service';
import { FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Actions } from '@datorama/akita-ng-effects';
import { OrderHistoryEntity } from '../../enitities';
import { CommodityEntity } from '../../../commodity/entities';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OrderEntity } from '../../enitities/order.entity';
import { ModalAlertEntity } from '@minhdu-fontend/base-entity';
import {
  ModalUpdateClosedCommodityComponent
} from '../../../commodity/component/modal-update-closed-commodity/modal-update-closed-commodity.component';
import {
  SelectCommodityComponent
} from 'apps/sell/src/app/shared/components/select-commodity/select-commodity.component';
import { AccountQuery } from '../../../../../../../../libs/system/src/lib/state/account-management/account.query';

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
  orderHistories: OrderHistoryEntity[] = [];

  formGroup = new FormGroup({
    content: new FormControl<string>(''),
    commodity: new FormControl<string>('')
  });

  constructor(
    private readonly actions$: Actions,
    private readonly activatedRoute: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly orderHistoryService: OrderHistoryService,
    private readonly modal: NzModalService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly orderQuery: OrderQuery,
    private readonly accountQuery: AccountQuery
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(OrderActions.loadOne({ id: this.getOrderId }));

    this.loadInitOrderHistory();

    this.activatedRoute.queryParams.subscribe((param) => {
      if (param.isUpdate === 'true') {
        const order = this.orderQuery.getEntity(this.getOrderId);
        if (order) {
          this.onUpdate(order, 'GENERAL');
        }
      }
    });

    this.formGroup.valueChanges
      .pipe(debounceTime(1500))
      .subscribe((val) => {
        this.loadInitOrderHistory(val);
      });
  }

  get getOrderId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  onDetail(id: number) {
    this.router.navigate(['tuyen-duong/chi-tiet-tuyen-duong', id]).then();
  }

  onUpdate(order: OrderEntity, type?: 'GENERAL' | 'COMMODITY') {
    if (type === 'GENERAL') {
      this.modal.create({
        nzTitle: 'Sửa đơn hàng',
        nzContent: OrderDialogComponent,
        nzComponentParams: {
          data: { order: order, tab: 0, isUpdate: true }
        },
        nzFooter: [],
        nzWidth: '65vw',
        nzMaskClosable: false
      });
    } else {
      this.modal
        .create({
          nzTitle: 'Chọn hàng hoá',
          nzContent: SelectCommodityComponent,
          nzComponentParams: {
            data: { type: 'DIALOG' },
            formGroup: this.formBuilder.group({ customerIds: [] })
          },
          nzWidth: '70vw',
          nzFooter: []
        })
        .afterClose.subscribe((value) => {
        if (value) {
          this.actions$.dispatch(
            OrderActions.update({
              id: order.id,
              updates: {
                commodityIds: Array.from(value)
              }
            })
          );
        }
      });
    }
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

  onRoute(id: number) {
    this.router.navigate(['khach-hang/chi-tiet-khach-hang', id]).then();
  }

  closingCommodity(commodity: CommodityEntity, orderId: number) {
    this.modal
      .create({
        nzTitle: 'Chốt hàng hoá',
        nzContent: ModalUpdateClosedCommodityComponent,
        nzComponentParams: <{ data: ModalAlertEntity }>{
          data: {
            description: `Bạn có chắc chắn muốn ${
              (commodity.closed ? 'bỏ chốt ' : 'chốt ') + commodity.name
            }`
          }
        },
        nzFooter: []
      })
      .afterClose.subscribe((res) => {
      if (res) {
        this.actions$.dispatch(
          CommodityAction.update({
            id: commodity.id,
            updates: {
              logged: res.save,
              orderId: orderId,
              closed: !commodity.closed
            }
          })
        );
      }
    });
  }

  refreshOrderHistory() {
    this.loading$.next(true);
    this.loadInitOrderHistory();
  }

  loadInitOrderHistory(search?: any) {
    this.orderHistoryService.pagination({
      take: 20,
      skip: 0,
      orderId: this.getOrderId,
      commodity: search ? search.commodity : '',
      content: search ? search.content : ''
    }).subscribe((res) => {
      if (res) {
        this.orderHistories = res.data;
        this.loading$.next(false);
      }
    });
  }

  onDelete($event: any) {
    this.modal.warning({
      nzTitle: 'Xoá đơn hàng',
      nzContent: `Bạn có chắc chắn muốn xoá đơn hàng này vĩnh viễn`,
      nzOnOk: () => {
        this.actions$.dispatch(OrderActions.remove({ id: $event.id }));
        this.orderQuery
          .select((state) => state.deleted)
          .subscribe((val) => {
            if (val) {
              this.router.navigate(['don-hang']).then();
            }
          });
      }
    });
  }
}
