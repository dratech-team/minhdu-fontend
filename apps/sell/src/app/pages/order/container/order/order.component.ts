import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Api } from '@minhdu-fontend/constants';
import { ConvertBoolean, PaymentType, StatusOrder } from '@minhdu-fontend/enums';
import { ExportService } from '@minhdu-fontend/service';
import { select, Store } from '@ngrx/store';
import { PaidType } from 'libs/enums/paidType.enum';
import { PageTypeEnum } from 'libs/enums/sell/page-type.enum';
import { document } from 'ngx-bootstrap/utils';
import { debounceTime, tap } from 'rxjs/operators';
import { OrderAction } from '../../+state/order.action';
import { selectorAllOrders ,selectedOrderLoaded} from '../../+state/order.selector';
import { AppState } from '../../../../reducers';
import { OrderDialogComponent } from '../../component/order-dialog/order-dialog.component';
import { CurrenciesConstant } from '@minhdu-fontend/constants';

@Component({
  templateUrl: 'order.component.html'
})
export class OrderComponent implements OnInit {
  pageTypeEnum = PageTypeEnum;
  paidType = PaidType;
  statusOrder = StatusOrder;
  currenciesConstant = CurrenciesConstant;
  convertBoolean = ConvertBoolean;
  payType = PaymentType;
  pageSize = 40;
  pageIndexInit = 0;
  formGroup = new FormGroup({
    paidType: new FormControl(''),
    name: new FormControl(''),
    deliveredAt: new FormControl(''),
    explain: new FormControl(''),
    createdAt: new FormControl(''),
    commodityTotal: new FormControl(''),
    destination: new FormControl('')
  });

  constructor(
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly exportService: ExportService
  ) {
  }

  orders$ = this.store.pipe(select(selectorAllOrders));
  loaded$ = this.store.pipe(select(selectedOrderLoaded));

  ngOnInit() {
    document.getElementById('order').classList.add('btn-border');
    document.getElementById('route').classList.remove('btn-border');
    document.getElementById('customer').classList.remove('btn-border');
    this.store.dispatch(OrderAction.loadInit({ take: this.pageSize, skip: this.pageIndexInit }));
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.store.dispatch(OrderAction.loadInit(this.order(val)));
        })
      )
      .subscribe();
  }

  add() {
    this.router.navigate(['don-hang/them-don-hang']).then();
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(
      OrderAction.loadMoreOrders(this.order(val))
    );
  }

  order(val: any) {
    return {
      skip: this.pageIndexInit,
      take: this.pageSize,
      paidType: val.paidType,
      customer: val.name.trim(),
      destination: val.destination.trim(),
      commodityTotal: val.commodityTotal,
      explain: val.explain.trim(),
      createdAt: val.createdAt.trim(),
      deliveredAt: val.deliveredAt === this.statusOrder.DELIVERED ?
        this.convertBoolean.TRUE :
        this.convertBoolean.FALSE
    };
  }

  detailOrder(id: number) {
    this.router.navigate(['don-hang/chi-tiet-don-hang', id]).then();
  }

  UpdateOrder($event: any) {
    this.dialog.open(OrderDialogComponent, {
      width: '60%',
      data: { order: $event, type: 'DELIVERED' }
    });
  }

  addOrder() {
    this.router.navigate(['/don-hang/them-don-hang']).then();
  }

  printOrder() {
    const val = this.formGroup.value;
    const order = {
      paidType: val.paidType,
      customer: val.name.trim(),
      destination: val.destination.trim(),
      commodityTotal: val.commodityTotal.trim(),
      explain: val.explain.trim(),
      createdAt: val.createdAt.trim(),
      deliveredAt: val.deliveredAt === this.statusOrder.DELIVERED ?
        this.convertBoolean.TRUE :
        this.convertBoolean.FALSE
    };
    this.exportService.print(Api.ORDER_EXPORT, order);
  }
}
