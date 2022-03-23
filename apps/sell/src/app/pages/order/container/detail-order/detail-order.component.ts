import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderEntity} from '../../enitities/order.interface';
import {CommodityUnit, MenuEnum, PaymentType} from '@minhdu-fontend/enums';
import {OrderActions} from '../../+state/order.actions';
import {OrderDialogComponent} from '../../component/order-dialog/order-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {CommodityAction} from '../../../commodity/+state/commodity.action';
import {CommodityDialogComponent} from '../../../commodity/component/commodity-dialog/commodity-dialog.component';
import {PickCommodityComponent} from '../../../../shared/components/pick-commodity/pick-commodity.component';
import {
  DialogSharedComponent
} from '../../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component';
import {OrderHistoryService} from '../../service/order-history.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormControl, FormGroup} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {Actions} from '@datorama/akita-ng-effects';
import {OrderQuery} from '../../+state/order.query';
import {OrderHistoryEntity} from '../../enitities/order-history.entity';
import {CommodityEntity} from '../../../commodity/entities/commodity.entity';
import {CommodityQuery} from '../../../commodity/+state/commodity.query';
import {NzModalService} from "ng-zorro-antd/modal";

@Component({
  templateUrl: 'detail-order.component.html'
})
export class DetailOrderComponent implements OnInit {
  order$ = this.orderQuery.selectEntity(this.getOrderId);
  payType = PaymentType;
  commodityUnit = CommodityUnit;
  orderHistories: OrderHistoryEntity[] = [];
  loading$ = new BehaviorSubject<boolean>(false);

  formOrderHistory = new FormGroup({
    content: new FormControl(''),
    commodity: new FormControl('')
  });

  constructor(
    private readonly actions$: Actions,
    private readonly orderQuery: OrderQuery,
    private readonly commodityQuery: CommodityQuery,
    private readonly activatedRoute: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly orderHistoryService: OrderHistoryService,
    private readonly modal: NzModalService,
    private readonly viewContentRef: ViewContainerRef
  ) {
  }

  ngOnInit() {
    this.loading$.subscribe(val => console.log(val));
    this.actions$.dispatch(OrderActions.loadOne({id: this.getOrderId}));
    this.loadInitOrderHistory();

    this.activatedRoute.queryParams.subscribe(param => {
      if (param.isUpdate === 'true') {
        const order = this.orderQuery.getEntity(this.getOrderId);
        if (order) {
          this.updateOrder(order);

        }
      }
    });

    this.formOrderHistory.valueChanges.pipe(debounceTime(1500)).subscribe(val => {
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
        nzViewContainerRef: this.viewContentRef,
        nzComponentParams: {
          data: {order: order, tab: 1, isUpdate: true}
        },
        nzFooter: null,
        nzWidth: '65vw',
        nzMaskClosable: false
      });
    } else {
      this.modal.create({
        nzTitle: 'Chọn hàng hoá',
        nzContent: PickCommodityComponent,
        nzComponentParams: {
          data: {commoditiesSelected: order.commodities, type: 'DIALOG'}
        },
        nzWidth:'70vw',
        nzFooter: null
      }).afterClose.subscribe(value => {
        this.actions$.dispatch(OrderActions.update({
          id: order.id,
          updates: {
            commodityIds: value.map((e: any) => e.id)
          },
        }));
      })
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
        data: {commodity, isUpdate: true, orderId: orderId}
      },
      nzFooter: null,
    })
  }

  deleteCommodity(commodity: CommodityEntity) {
    this.dialog.open(DialogSharedComponent, {
        width: 'fit-content',
        data: {
          title: 'Xoá hàng hoá',
          description: `Bạn có chắc chắn muốn xoá hàng hoá ${commodity.name}`
        }
      }
    ).afterClosed().subscribe(val => {
      if (val) {
        if (commodity.orderId)
          this.actions$.dispatch(CommodityAction.remove({id: commodity.id, inOrder: {orderId: commodity.orderId}}));
      }
    });
  }

  onRoute(id: number) {
    this.router.navigate(['khach-hang/chi-tiet-khach-hang', id]).then();
  }

  closingCommodity(commodity: CommodityEntity, orderId: number) {
    this.dialog.open(DialogSharedComponent, {
      width: 'fit-content', data: {
        title: 'Chốt hàng hoá',
        description: 'Bạn có chắc chắn muốn ' + (commodity.closed ? 'bỏ chốt ' : 'chốt ') + commodity.name
      }
    }).afterClosed().subscribe(val => {
      if (val) {
        this.actions$.dispatch(CommodityAction.update({
          id: commodity.id,
          updates: {
            orderId: orderId,
            closed: !commodity.closed
          },
          inOrder: true
        }));
      }
    });
  }

  loadMoreOrderHistory() {
    this.orderHistoryService.pagination({
      skip: this.orderHistories.length,
      take: 10,
      orderId: this.getOrderId,
      content: this.formOrderHistory.value.content,
      commodity: this.formOrderHistory.value.commodity
    }).subscribe(val => {
      if (val.data.length > 0) {
        this.orderHistories = this.orderHistories.concat(val.data);
      } else {
        this.snackBar.open('Đã lấy hết lịch sử chỉnh sửa đơn hàng', '', {duration: 1500});
      }
    });
  }

  refreshOrderHistory() {
    this.loading$.next(true);
    this.loadInitOrderHistory();
  }

  loadInitOrderHistory(search?: any) {
    this.orderHistoryService.pagination({
      take: 6,
      skip: 0,
      orderId: this.getOrderId,
      commodity: search ? search.commodity : '',
      content: search ? search.content : ''
    }).subscribe(val => {
      if (val) {
        this.orderHistories = val.data;
        this.loading$.next(false);
        this.snackBar.open('Tải lịch sử chỉnh sửa đơn hàng thành công', '', {duration: 1500});
      }
    });
  }
}
