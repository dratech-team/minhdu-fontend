import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentHistory } from '@minhdu-fontend/data-models';

@Component({
  templateUrl: 'payment-history.component.html'
})
export class PaymentHistoryComponent implements OnInit{
  paymentHistories: PaymentHistory[] = [];
  constructor(
    private readonly route: ActivatedRoute,
  ) {
  }
  ngOnInit() {
      this.route.queryParams.subscribe(param =>{
        this.paymentHistories = JSON.parse(param.data)
      })
  }
}
