import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order, OrderHistory } from '../../enitities/order.interface';
import { CommodityUnit, MenuEnum, PaymentType } from '@minhdu-fontend/enums';
import { OrderActions } from '../../+state/order.actions';
import { OrderDialogComponent } from '../../component/order-dialog/order-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommodityAction } from '../../../commodity/+state/commodity.action';
import { DialogDeleteComponent } from '@minhdu-fontend/components';
import { MainAction } from '../../../../states/main.action';
import { Commodity } from '../../../commodity/+state/commodity.interface';
import { CommodityDialogComponent } from '../../../commodity/component/commodity-dialog/commodity-dialog.component';
import { PickCommodityComponent } from '../../../../shared/components/pick-commodity/pick-commodity.component';
import { DialogSharedComponent } from '../../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component';
import { OrderHistoryService } from '../../service/order-history.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Actions } from '@datorama/akita-ng-effects';
import { OrderQuery } from '../../+state/order.query';

@Component({
  templateUrl: 'detail-order.component.html'
})
export class DetailOrderComponent implements OnInit {
  order$ = this.orderQuery.selectEntity(this.getOrderId);
  payType = PaymentType;
  commodityUnit = CommodityUnit;
  orderHistories: OrderHistory[] = [];
  loading$ = new BehaviorSubject<boolean>(false);

  formOrderHistory = new FormGroup({
    content: new FormControl(''),
    commodity: new FormControl('')
  });

  constructor(
    private readonly actions$: Actions,
    private readonly orderQuery: OrderQuery,
    private readonly activatedRoute: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly orderHistoryService: OrderHistoryService
  ) {
  }

  ngOnInit() {
    this.loading$.subscribe(val => console.log(val));
    this.actions$.dispatch(MainAction.updateStateMenu({ tab: MenuEnum.ORDER }));
    this.actions$.dispatch(OrderActions.loadOne({ id: this.getOrderId }));
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

  updateOrder(order: Order, type?: 'GENERAL' | 'COMMODITY') {
    if (type === 'GENERAL') {
      this.dialog.open(OrderDialogComponent, { width: '60%', data: { order: order, tab: 1, type: 'UPDATE' } });
    } else {
      this.dialog.open(PickCommodityComponent, {
        width: '60%',
        data: { commoditiesSelected: order.commodities, type: 'DIALOG' }
      }).afterClosed().subscribe((value) => {
        this.actions$.dispatch(OrderActions.update({
          updateOrderDto: {
            id: order.id,
            order: {
              commodityIds: value.map((e: any) => e.id)
            }
          }
        }));
      });
    }
  }

  detailRoute(id: number) {
    this.router.navigate(['tuyen-duong/chi-tiet-tuyen-duong', id]).then();
  }

  updateCommodity(orderId: number, commodity: Commodity) {
    this.dialog.open(CommodityDialogComponent, { data: { commodity, isUpdate: true, orderId: orderId }, width: '30%' });
  }

  deleteCommodity(commodityId: number) {
    const ref = this.dialog.open(DialogDeleteComponent, { width: '30%' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.actions$.dispatch(CommodityAction.deleteCommodity({ id: commodityId, orderId: this.getOrderId }));
      }
    });
  }

  onRoute(id: number) {
    this.router.navigate(['khach-hang/chi-tiet-khach-hang', id]).then();
  }

  closingCommodity(commodity: Commodity, orderId: number) {
    const ref = this.dialog.open(DialogSharedComponent, {
      width: 'fit-content', data: {
        title: 'Chốt hàng hoá',
        description: 'Bạn có chắc chắn muốn ' + (commodity.closed ? 'bỏ chốt ' : 'chốt ') + commodity.name
      }
    });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.actions$.dispatch(CommodityAction.updateCommodity({
          orderId: orderId,
          id: commodity.id,
          commodity: { closed: !commodity.closed }
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
        this.snackBar.open('Đã lấy hết lịch sử chỉnh sửa đơn hàng', '', { duration: 1500 });
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
        this.snackBar.open('Tải lịch sử chỉnh sửa đơn hàng thành công', '', { duration: 1500 });
      }
    });
  }
}
