import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, tap } from 'rxjs/operators';
import { TablePaymentRouteService } from './table-payment-route.service';
import { PaymentType } from '@minhdu-fontend/enums';
import { PaymentHistory } from '@minhdu-fontend/data-models';
import { selectorAllPayment } from '../../+state/payment/payment.selector';
import { PaymentAction } from '../../+state/payment/payment.action';

@Component({
  selector: 'app-table-payment',
  templateUrl: 'table-payment.component.html'
})

export class TablePaymentComponent implements OnInit {
  formGroup = new FormGroup(
    {
      name: new FormControl(''),
      paidAt: new FormControl(''),
      createdAt: new FormControl('')
    });
  payType = PaymentType;
  @Input() customerId!: number;
  pageSize = 10;
  pageIndex = 1;
  pageIndexInit = 0;
  paymentHistories$ = this.store.pipe(select(selectorAllPayment));

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly paymentService: TablePaymentRouteService
  ) {
  }

  ngOnInit() {
    this.store.dispatch(PaymentAction.loadInit({ take: 10, skip: 0, customerId: this.customerId }));
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((value) => {
        this.paymentService.searchPayments(this.paymentHistory(this.pageSize, this.pageIndexInit, value));
      })).subscribe();
  }

  onScroll() {
    const val = this.formGroup.value;
    this.paymentService.scrollPayments(this.paymentHistory(this.pageSize, this.pageIndex, val));
  }

  paymentHistory(pageSize: number, pageIndex: number, val?: any): any {
    pageIndex === 0 ? this.pageIndex = 1 : this.pageIndex++;
    return {
      take: pageSize,
      skip: pageSize * pageIndex,
      customerId: this.customerId
    };
  }
}
