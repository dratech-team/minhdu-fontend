import { Component, OnInit } from '@angular/core';
import { AdminAction } from '../../../../states/admin.action';
import { MenuEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { SalaryPaymentService } from '../service/salary-payment.service';
import { FormControl, FormGroup } from '@angular/forms';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { searchAutocomplete } from '../../../../../../../../libs/utils/orgchart.ultil';
import { debounceTime, startWith } from 'rxjs/operators';


@Component({
  templateUrl: 'overview.component.html'
})
export class OverviewComponent implements OnInit {
  type = 'YEAR';
  data: any[] = [];
  formGroup = new FormGroup({
    branch: new FormControl(''),
    name: new FormControl(''),
  });
  branches$ = this.store.pipe(select(getAllOrgchart));

  constructor(
    private readonly store: Store,
    private readonly salaryPaymentService: SalaryPaymentService
  ) {
  }

  ngOnInit() {
    this.store.dispatch(OrgchartActions.init());
    this.branches$ = searchAutocomplete(
      this.formGroup.get('branch')!.valueChanges.pipe(startWith('')),
      this.branches$
    );
    this.store.dispatch(AdminAction.updateStateMenu({ tab: MenuEnum.OVERVIEW }));
    this.salaryPaymentService.getAll({ type: this.type }).subscribe(val => {
      if (val) {
        this.data = val
      }
    });

    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe(val => {
      this.salaryPaymentService.getAll(this.mapVal(val)).subscribe(val => {
        if (val) {
          this.data = val
        }
      })
    })
  }


  mapVal(val: any){
    return{
      type: this.type,
      name: val.name,
      branch:val.branch
    }
  }

  onSelectBranch(branchName: string) {
    this.formGroup.get('branch')!.patchValue(branchName);
  }
}
