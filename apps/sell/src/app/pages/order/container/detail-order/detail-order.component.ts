import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../reducers';
import {selectorCurrentOrder} from '../../+state/order.selector';
import {ActivatedRoute, Router} from '@angular/router';
import {Order, OrderHistory} from '../../+state/order.interface';
import {CommodityUnit, ConvertBoolean, MenuEnum, PaymentType} from '@minhdu-fontend/enums';
import {OrderAction} from '../../+state/order.action';
import {OrderDialogComponent} from '../../component/order-dialog/order-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {CommodityAction} from '../../../commodity/+state/commodity.action';
import {DialogDeleteComponent} from '@minhdu-fontend/components';
import {MainAction} from '../../../../states/main.action';
import {getSelectors} from '@minhdu-fontend/utils';
import {Commodity} from '../../../commodity/entities/commodity.entity';
import {CommodityDialogComponent} from '../../../commodity/component/commodity-dialog/commodity-dialog.component';
import {PickCommodityComponent} from '../../../../shared/components/pick-commodity/pick-commodity.component';
import {
  DialogSharedComponent
} from "../../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component";
import {OrderHistoryService} from "../../service/order-history.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  templateUrl: 'detail-order.component.html'
})
export class DetailOrderComponent implements OnInit {
  order$ = this.store.select(selectorCurrentOrder(this.getOrderId));
  payType = PaymentType;
  commodityUnit = CommodityUnit;
  orderHistories: OrderHistory[] = []

  constructor(
    private readonly store: Store<AppState>,
    private readonly activatedRoute: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly orderHistoryService: OrderHistoryService,
  ) {
  }

  ngOnInit() {
    this.store.dispatch(MainAction.updateStateMenu({tab: MenuEnum.ORDER}));
    this.store.dispatch(OrderAction.getOrder({id: this.getOrderId}));
    this.orderHistoryService.pagination({take: 6, skip: 0, orderId: this.getOrderId}).subscribe(val => {
      if (val) {
        this.orderHistories = val.data
      }
    })

    this.activatedRoute.queryParams.subscribe(param => {
      if (param.isUpdate === 'true') {
        this.updateOrder(getSelectors(selectorCurrentOrder(this.getOrderId), this.store));
      }
    });
  }

  get getOrderId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  updateOrder(order: Order, type?: 'GENERAL' | 'COMMODITY') {
    if (type === 'GENERAL') {
      this.dialog.open(OrderDialogComponent, {width: '60%', data: {order: order, tab: 1, type: 'UPDATE'}});
    } else {
      this.dialog.open(PickCommodityComponent, {
        width: '60%',
        data: {commoditiesSelected: order.commodities, type: 'DIALOG'}
      }).afterClosed().subscribe((value) => {
        this.store.dispatch(OrderAction.updateOrder({
          id: order.id,
          order: {commodityIds: value.map((e: any) => e.id)}
        }));
      });
    }
  }

  detailRoute(id: number) {
    this.router.navigate(['tuyen-duong/chi-tiet-tuyen-duong', id]).then();
  }

  updateCommodity(orderId: number, commodity: Commodity) {
    this.dialog.open(CommodityDialogComponent, {data: {commodity, isUpdate: true, orderId: orderId}, width: '30%'});
  }

  deleteCommodity(commodityId: number) {
    const ref = this.dialog.open(DialogDeleteComponent, {width: '30%'});
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(CommodityAction.deleteCommodity({id: commodityId, orderId: this.getOrderId}));
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
    })
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(CommodityAction.updateCommodity({
          orderId: orderId,
          id: commodity.id,
          commodity: {closed: !commodity.closed},
        }))
      }
    })

  }

  loadMoreOrderHistory() {
    console.log('sss')
    this.orderHistoryService.pagination({
      skip: this.orderHistories.length,
      take: 10,
      orderId: this.getOrderId
    }).subscribe(val => {
      if (val.data.length > 0) {
        this.orderHistories = this.orderHistories.concat(val.data)
      } else {
        this.snackBar.open('Đã lấy hết lịch sử chỉnh sửa đơn hàng', '', {duration: 1500})
      }
    })
  }
}
