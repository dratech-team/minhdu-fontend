import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { StatisticalSellService } from '../../service/statistical-sell.service';
import { OverviewSell } from '../../entity/overview.entity';
import { Observable } from 'rxjs';

@Component({
  templateUrl: 'statistical-sell.component.html',
  styleUrls: ['statistical-sell.component.scss']
})
export class StatisticalSellComponent implements OnInit {
  overview$: Observable<OverviewSell> = this.service.getAll({
    filter: 'MONTH',
    datetime: new Date()
  });

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly service: StatisticalSellService
  ) {
  }

  ngOnInit() {
    const btnOrder = document.getElementById('home');
    btnOrder?.classList.add('btn-border');
  }

  valueChange(event: any) {
    this.overview$ = this.service.getAll({
      filter: 'MONTH',
      datetime: event.target.value || new Date()
    });
  }
}
