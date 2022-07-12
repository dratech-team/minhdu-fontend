import { Component, OnInit } from '@angular/core';
import { stakedChart } from '@minhdu-fontend/data-models';
import { getMonth } from 'ngx-bootstrap/chronos';
import { DatetimeUnitEnum, MenuWarehouseEum } from '@minhdu-fontend/enums';
import { UntypedFormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AdminAction } from '../../../../states/admin.action';
import { Store } from '@ngrx/store';
import { StatisticalSellService } from '../../service/statistical-sell.service';
import { tap } from 'rxjs/operators';
import { OverviewSell } from '../../entity/overview.entity';
import { Observable } from 'rxjs';
import { MenuAdminEnum } from '../../../../../enums/menu-admin.enum';

@Component({
  templateUrl: 'statistical-sell.component.html',
  styleUrls: ['statistical-sell.component.scss'],
})
export class StatisticalSellComponent implements OnInit {
  overview$: Observable<OverviewSell> = this.service.getAll({
    filter: 'MONTH',
    datetime: new Date(),
  });

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly service: StatisticalSellService
  ) {}

  ngOnInit() {
    this.store.dispatch(
      AdminAction.updateStateMenu({ tab: MenuAdminEnum.OVERVIEW_SELL })
    );
    const btnOrder = document.getElementById('home');
    btnOrder?.classList.add('btn-border');
  }

  valueChange(event: any) {
    this.overview$ = this.service.getAll({
      filter: 'MONTH',
      datetime: event.target.value || new Date(),
    });
  }
}
