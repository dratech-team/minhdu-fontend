import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { selectorCurrentBill } from '../../+state/bill.selector';

@Component({
  templateUrl:'detail-bill.component.html'
})
export class DetailBillComponent implements OnInit{
  bill$ = this.store.pipe(select(selectorCurrentBill(this.BillId)))
  constructor(
    private readonly store: Store,
    private readonly activatedRoute: ActivatedRoute
  ) {
  }
  ngOnInit() {
  }
  get BillId(): number {
    return this.activatedRoute.snapshot.params.id
  }
}
