import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { OrgchartEnum } from '@minhdu-fontend/enums';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, startWith } from 'rxjs/operators';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { getAllOrgchart, getOrgchartLoaded, OrgchartActions } from '@minhdu-fontend/orgchart';
import { DialogBranchComponent } from '../../component/dialog-branch/dialog-branch.component';
import { Router } from '@angular/router';
import { PageTypeEnum } from 'libs/enums/sell/page-type.enum';
import { PayrollAction } from '../../../payroll/+state/payroll/payroll.action';
import { getAllPosition } from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { searchAutocomplete } from '../../../../../../../../libs/utils/orgchart.ultil';

@Component({
  templateUrl: 'branch.container.html'
})
export class BranchContainer implements OnInit {
  branches$ = this.store.pipe(select(getAllOrgchart));
  branchLoaded$ = this.store.pipe(select(getOrgchartLoaded));
  positions$ = this.store.pipe(select(getAllPosition));
  type = OrgchartEnum;
  pageSize = 30;
  pageIndexInit = 0;
  formGroup = new FormGroup({
    code: new FormControl(''),
    branch:new FormControl(),
    position: new FormControl('')
  })
  pageType = PageTypeEnum;

  constructor(
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.store.dispatch(OrgchartActions.init());
    this.formGroup.get('branch')!.valueChanges.pipe(debounceTime(1000)).subscribe(val => {
      this.store.dispatch(OrgchartActions.searchBranch({ branch: val }));
    });
    this.positions$ = searchAutocomplete(
      this.formGroup.get('position')!.valueChanges.pipe(startWith('')),
      this.positions$
    );
  }

  addBranch() {
    this.dialog.open(DialogBranchComponent, { width: 'fit-content' });
  }

  detailBranch($event: any) {
    this.router.navigate(['to-chuc/chi-tiet-don-vi/', $event.id]).then();
  }

  deleteBranch($event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, { width: '30%' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(OrgchartActions.deleteBranch({ id: $event.id }));
      }
    });
  }

  onEmployee(event: any){
    this.router.navigate(['ho-so'], {
      queryParams:{
        branch: event.name
      }
    }).then()
  }
  onPayroll(event: any){
    this.store.dispatch(PayrollAction.updateStatePayroll({branch: event.name}))
    this.router.navigate(['phieu-luong']).then()
  }
  onOvertime(event: any){
    this.store.dispatch(PayrollAction.updateStatePayroll({branch: event.name}))
    this.router.navigate(['phieu-luong'], {
      queryParams:{
        type:'overtime'
      }
    }).then()
  }

  onSelectPosition(positionName: string) {
    this.formGroup.get('position')!.patchValue(positionName);
  }

  onListPosition(event: any) {
    this.router.navigate(['to-chuc/chuc-vu', event.id]).then()
  }

  updateBranch($event: any) {
    this.dialog.open(DialogBranchComponent,
      { width: 'fit-content', data: { branch: $event, isUpdate: true } });
  }
}
