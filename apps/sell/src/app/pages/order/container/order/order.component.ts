import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { selectorAllOrders } from '../../+state/order.selector';
import { OrderAction } from '../../+state/order.action';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyUnit, PaymentType, TypeFile } from '@minhdu-fontend/enums';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { PaidType } from 'libs/enums/paidType.enum';
import { document } from 'ngx-bootstrap/utils';
import { OrderDialogComponent } from '../../component/order-dialog/order-dialog.component';
import { PageTypeEnum } from 'libs/enums/sell/page-type.enum';
import { Api } from '@minhdu-fontend/constants';
import { DownloadService, ExportService } from '@minhdu-fontend/service';


@Component({
  templateUrl: 'order.component.html'

})
export class OrderComponent implements OnInit {
  pageTypeEnum = PageTypeEnum;
  paidType = PaidType;
  currencyUnit = CurrencyUnit;
  payType = PaymentType;
  pageIndex = 1;
  pageSize = 30;
  orders$ = this.store.pipe(select(selectorAllOrders));
  formGroup = new FormGroup(
    {
      paidType: new FormControl(''),
      name: new FormControl('')
    }
  );

  constructor(
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly exportService: ExportService,
    private readonly downloadService: DownloadService
  ) {
  }

  ngOnInit() {
    document.getElementById('order').classList.add('btn-border');
    document.getElementById('route').classList.remove('btn-border');
    document.getElementById('customer').classList.remove('btn-border');
    this.store.dispatch(OrderAction.loadInit({ take: 30, skip: 0 }));
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((val) => {
          this.store.dispatch(OrderAction.loadInit(this.order(val, 30, 0)));
        }
      )
    ).subscribe();
  }

  add() {
    this.router.navigate(['/ban-hang/don-hang/them-don-hang']).then();
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(OrderAction.loadMoreOrders(this.order(val, this.pageSize, this.pageIndex)));
  }

  order(val: any, pageSize: number, pageIndex: number) {
    return {
      skip: pageSize * pageIndex++,
      take: pageSize,
      paidType: val.paidType,
      customer: val.name.trim()
    };
  }

  detailOrder(id: number) {
    this.router.navigate(['/ban-hang/don-hang/chi-tiet-don-hang', id]).then();
  }

  UpdateOrder($event: any) {
    this.dialog.open(OrderDialogComponent, { width: '60%', data: { order: $event, type: 'DELIVERED' } });
  }

  addOrder() {
    this.router.navigate(['/ban-hang/don-hang/them-don-hang']).then();
  }

  printOrder() {
    const val = this.formGroup.value;
    const order = {
      paidType: val.paidType,
      customer: val.name.trim()
    };
    this.exportService.print(Api.ORDER_EXPORT, order).subscribe(val => {
        const fileName = `Danh sách đơn hàng`;
        const type = TypeFile.EXCEL;
        this.downloadService.downloadFile(val, type, fileName);
      }
    );
  }
}
