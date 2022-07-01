import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BillQuery } from '../../state';

@Component({
  templateUrl: 'detail-bill.component.html'
})
export class DetailBillComponent implements OnInit {
  bill$ = this.billQuery.selectEntity(this.activatedRoute.snapshot.params.id);

  constructor(
    private readonly billQuery: BillQuery,
    private readonly activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
  }
}
