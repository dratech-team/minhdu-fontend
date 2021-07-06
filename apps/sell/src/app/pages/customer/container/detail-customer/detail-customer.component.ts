import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { selectorCurrentCustomer } from '../../+state/customer.selector';
import { ActivatedRoute } from '@angular/router';
import { CustomerAction } from '../../+state/customer.action';
import { Customer } from '../../+state/customer.interface';

@Component({
  templateUrl: 'detail-customer.component.html',
  styleUrls: ['detail-customer.component.scss']
})
export class DetailCustomerComponent implements OnInit {
  customer$ = this.store.pipe(select(selectorCurrentCustomer(this.getId)));

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store<AppState>
  ) {
  }

  ngOnInit() {
    this.store.dispatch(CustomerAction.getCustomer({ id: this.getId }));
  }

  updateCustomer(customer: Customer) {

  }

  get getId(): number {
    return this.activatedRoute.snapshot.params.id;
  }
}
