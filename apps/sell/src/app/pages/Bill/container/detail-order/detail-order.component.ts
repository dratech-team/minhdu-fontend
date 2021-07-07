import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { selectorCurrentOrder } from '../+state/order.selector';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl:'detail-order.component.html',
})
export class DetailOrderComponent implements OnInit {
  order$ = this.store.pipe(select(selectorCurrentOrder(this.getOrderId)))
  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private readonly store: Store<AppState>,
    private readonly activatedRoute: ActivatedRoute,
  ) {
  }
  ngOnInit() {
  }
  get getOrderId():number{
    return this.activatedRoute.snapshot.params.id;
  }
}
