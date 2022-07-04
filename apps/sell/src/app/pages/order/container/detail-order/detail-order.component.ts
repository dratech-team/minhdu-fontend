import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommodityUnit, PaymentType } from '@minhdu-fontend/enums';
import { OrderActions, OrderQuery } from '../../+state';
import { OrderDialogComponent } from '../../component';
import { MatDialog } from '@angular/material/dialog';
import { CommodityAction, CommodityQuery } from '../../../commodity/state';
import { CommodityDialogComponent } from '../../../commodity/component';
import { PickCommodityComponent } from '../../../../shared/components/pick-commodity/pick-commodity.component';
import { DialogSharedComponent } from '../../../../../../../../libs/components/src/lib/dialog-shared';
import { OrderHistoryService } from '../../service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
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

@Component({
  templateUrl: 'detail-order.component.html'
})
export class DetailOrderComponent implements OnInit {
  order$ = this.orderQuery.selectEntity(this.getOrderId);
  payType = PaymentType;
  commodityUnit = CommodityUnit;
  orderHistories: OrderHistoryEntity[] = [];
  loading$ = new BehaviorSubject<boolean>(false);

  formOrderHistory = new UntypedFormGroup({
    content: new UntypedFormControl(''),
    commodity: new UntypedFormControl('')
  });

  constructor(
    private readonly actions$: Actions,
    private readonly orderQuery: OrderQuery,
    private readonly commodityQuery: CommodityQuery,
    private readonly activatedRoute: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly orderHistoryService: OrderHistoryService,
    private readonly modal: NzModalService,
    private readonly formBuilder: UntypedFormBuilder
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(OrderActions.loadOne({ id: this.getOrderId }));

    this.loadInitOrderHistory();

    this.activatedRoute.queryParams.subscribe((param) => {
      if (param.isUpdate === 'true') {
        const order = this.orderQuery.getEntity(this.getOrderId);
        if (order) {
          this.updateOrder(order, 'GENERAL');
        }
      }
    });

    this.formOrderHistory.valueChanges
      .pipe(debounceTime(1500))
      .subscribe((val) => {
        this.loadInitOrderHistory(val);
      });
  }

  get getOrderId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  updateOrder(order: OrderEntity, type?: 'GENERAL' | 'COMMODITY') {
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
          nzContent: PickCommodityComponent,
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

  detailRoute(id: number) {
    this.router.navigate(['tuyen-duong/chi-tiet-tuyen-duong', id]).then();
  }

  updateCommodity(orderId: number, commodity: CommodityEntity) {
    this.modal.create({
      nzTitle: 'Cập nhật hàng hoá',
      nzContent: CommodityDialogComponent,
      nzComponentParams: {
        data: { commodity, isUpdate: true }
      },
      nzFooter: []
    });
  }

  deleteCommodity(commodity: CommodityEntity) {
    this.dialog
      .open(DialogSharedComponent, {
        width: 'fit-content',
        data: {
          title: 'Xoá hàng hoá',
          description: `Bạn có chắc chắn muốn xoá hàng hoá ${commodity.name}`
        }
      })
      .afterClosed()
      .subscribe((val) => {
        if (val) {
          if (commodity.orderId)
            this.actions$.dispatch(
              CommodityAction.remove({
                id: commodity.id,
                inOrder: { orderId: commodity.orderId }
              })
            );
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
      .afterClose.subscribe((val) => {
      if (val) {
        this.actions$.dispatch(
          CommodityAction.update({
            id: commodity.id,
            updates: {
              logged: val.save,
              orderId: orderId,
              closed: !commodity.closed
            }
          })
        );
      }
    });
  }

  loadMoreOrderHistory() {
    this.orderHistoryService
      .pagination({
        skip: this.orderHistories.length,
        take: 10,
        orderId: this.getOrderId,
        content: this.formOrderHistory.value.content,
        commodity: this.formOrderHistory.value.commodity
      })
      .subscribe((res) => {
        if (res.data.length > 0) {
          this.orderHistories = this.orderHistories.concat(res.data);
        }
      });
  }

  refreshOrderHistory() {
    this.loading$.next(true);
    this.loadInitOrderHistory();
  }

  loadInitOrderHistory(search?: any) {
    this.orderHistoryService
      .pagination({
        take: 20,
        skip: 0,
        orderId: this.getOrderId,
        commodity: search ? search.commodity : '',
        content: search ? search.content : ''
      })
      .subscribe((res) => {
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
