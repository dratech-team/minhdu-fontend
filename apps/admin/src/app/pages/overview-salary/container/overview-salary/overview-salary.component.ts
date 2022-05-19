import { Component, OnInit } from '@angular/core';
import { AdminAction } from '../../../../states/admin.action';
import { MenuWarehouseEum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { SalaryPaymentService } from '../service/salary-payment.service';
import { FormControl, FormGroup } from '@angular/forms';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { checkInputNumber, searchAutocomplete } from '@minhdu-fontend/utils';
import { debounceTime, startWith } from 'rxjs/operators';
import { OverviewSalary } from '../model/overview-salary';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DetailOverviewComponent } from '../detail-overview/detail-overview.component';
import { of } from 'rxjs';
import {MenuAdminEnum} from "../../../../../enums/menu-admin.enum";


@Component({
  templateUrl: 'overview-salary.component.html'
})
export class OverviewSalaryComponent implements OnInit {
  data: OverviewSalary[] = [];
  total!: number;
  totalSalary!: number;
  formGroup = new FormGroup({
    branch: new FormControl(''),
    year: new FormControl('')
  });
  pageSize = 30;
  branches$ = this.store.pipe(select(getAllOrgchart));

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly datePipe: DatePipe,
    private readonly router: Router,
    private readonly salaryPaymentService: SalaryPaymentService
  ) {
  }

  ngOnInit() {
    this.store.dispatch(OrgchartActions.init());
    this.branches$ = searchAutocomplete(
      this.formGroup.get('branch')?.valueChanges.pipe(startWith('')) || of(''),
      this.branches$
    );
    this.store.dispatch(AdminAction.updateStateMenu({ tab: MenuAdminEnum.OVERVIEW }));
    this.salaryPaymentService.getAll({ take: 30, skip: 0 }).subscribe(val => {
      if (val) {
        this.totalSalary = val.totalSalary;
        this.data = val.data;
        this.total = val.data.length;
      }
    });

    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe(val => {
      this.salaryPaymentService.getAll(this.mapVal(val, true)).subscribe(val => {
        if (val) {
          this.totalSalary = val.totalSalary;
          this.data = val.data;
          this.total = val.data.length;
        }
      });
    });
  }

  detailOverviewSalary(overviewSalary: OverviewSalary) {
    this.dialog.open(DetailOverviewComponent, {
      width: 'fit-content',
      data: {
        id: overviewSalary.id,
        year: this.datePipe.transform(overviewSalary.datetime, 'yyyy'),
        title: overviewSalary.name
      }
    });
  }


  mapVal(val: any, isSearch?: boolean) {
    return {
      take: this.pageSize,
      skip: isSearch ? '' : this.total,
      year: val.year,
      branch: val.branch
    };
  }

  onSelectBranch(branchName: string) {
    this.formGroup.get('branch')?.patchValue(branchName);
  }

  checkInputNumber(event: any) {
    return checkInputNumber(event);
  }
}
