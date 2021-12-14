import { Component, OnInit } from '@angular/core';
import { AdminAction } from '../../../../states/admin.action';
import { MenuEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { FormControl, FormGroup } from '@angular/forms';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { searchAutocomplete } from '../../../../../../../../libs/utils/orgchart.ultil';
import { debounceTime, startWith } from 'rxjs/operators';
import { SalaryPaymentService } from '../../container/service/salary-payment.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  templateUrl: 'detail-overview.component.html'
})
export class DetailOverviewComponent implements OnInit {
  type = 'MONTH';
  data: any;
  formGroup = new FormGroup({
    month: new FormControl(''),
    total: new FormControl(''),
  });

  constructor(
    private readonly store: Store,
    private readonly activatedRoute: ActivatedRoute,
    private readonly salaryPaymentService: SalaryPaymentService
  ) {
  }

  ngOnInit() {
    this.store.dispatch(AdminAction.updateStateMenu({ tab: MenuEnum.OVERVIEW }));
    this.salaryPaymentService.getOne(this.getId).subscribe(val => {
      if (val) {
        this.data = val
      }
    });
    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe(val => {
      this.salaryPaymentService.getOne(this.getId, val.month).subscribe(val => {
        if (val) {
          this.data = val
        }
      })
    })
  }

  get getId(): number {
    return this.activatedRoute.snapshot.params.id
  }

  onSelectBranch(branchName: string) {
    this.formGroup.get('branch')!.patchValue(branchName);
  }
}
