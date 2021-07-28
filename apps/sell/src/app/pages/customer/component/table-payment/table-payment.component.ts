import { Component, Input, OnInit } from '@angular/core';
import {  Store } from '@ngrx/store';
import { FormControl, FormGroup } from '@angular/forms';
import { PaidType } from 'libs/enums/paidType.enum';
import { Router } from '@angular/router';
import { debounceTime, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TablePaymentRouteService } from './table-payment-route.service';
import { PaymentType } from '@minhdu-fontend/enums';
import { Payment } from '../../+state/payment/payment.interface';

@Component({
  selector:'app-table-payment',
  templateUrl:'table-payment.component.html',
})

export class TablePaymentComponent implements OnInit{
  paymentHistories$!: Observable<Payment[]>
  formGroup = new FormGroup(
    {
      name: new FormControl(''),
      paidAt: new FormControl(''),
      createdAt: new FormControl(''),
    });
  payType = PaymentType;
  @Input() customerId!: number;
  pageSize = 10;
  pageIndex = 1 ;
  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly paymentService: TablePaymentRouteService,
  ) {
  }
  ngOnInit() {
      this.paymentHistories$ = this.paymentService.getPayment()
      this.paymentService.loadInit(this.customerId)
      this.formGroup.valueChanges.pipe(
        debounceTime(1000),
        tap((value) => {
          this.paymentService.searchOrders(this.paymentHistory(10,0, value))
        })).subscribe();
  }
  onScroll(){
    const val = this.formGroup.value
      this.paymentService.scrollPayments(this.paymentHistory(this.pageSize, this.pageIndex, val))
  }
  paymentHistory(pageSize: number, pageIndex: number, val?: any): any{
    return {
      take: pageSize,
      skip: pageSize* pageIndex++,
      customerId:this.customerId,
    }
  }
}
