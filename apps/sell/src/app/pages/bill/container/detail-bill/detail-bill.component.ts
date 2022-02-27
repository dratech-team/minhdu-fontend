import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BillQuery } from '../../+state/bill.query';

@Component({
  templateUrl: 'detail-bill.component.html'
})
export class DetailBillComponent {
  bill$ = this.billQuery.selectEntity(this.BillId);

  constructor(
    private readonly billQuery: BillQuery,
    private readonly activatedRoute: ActivatedRoute
  ) {
  }

  get BillId(): number {
    return this.activatedRoute.snapshot.params.id;
  }
}
