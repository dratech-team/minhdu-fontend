import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import {
  FilterTypeEnum,
  ItemContextMenu,
  OrgchartEnum,
} from '@minhdu-fontend/enums';
import { MatDialog } from '@angular/material/dialog';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { debounceTime, startWith } from 'rxjs/operators';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import {
  getAllOrgchart,
  getOrgchartLoaded,
  OrgchartActions,
} from '@minhdu-fontend/orgchart';
import { DialogBranchComponent } from '../../component/dialog-branch/dialog-branch.component';
import { Router } from '@angular/router';
import { PayrollAction } from '../../../payroll/+state/payroll/payroll.action';
import { getAllPosition } from '@minhdu-fontend/orgchart-position';
import { checkInputNumber, searchAutocomplete } from '@minhdu-fontend/utils';
import { DialogExportComponent } from '@minhdu-fontend/components';
import { Api } from '@minhdu-fontend/constants';
import { of } from 'rxjs';
import { Branch } from '@minhdu-fontend/data-models';

@Component({
  templateUrl: 'branch.container.html',
})
export class BranchContainer implements OnInit {
  pageSize = 30;
  pageIndexInit = 0;
  type = OrgchartEnum;
  ItemContextMenu = ItemContextMenu;

  branches$ = this.store.pipe(select(getAllOrgchart));
  branchLoaded$ = this.store.pipe(select(getOrgchartLoaded));
  positions$ = this.store.pipe(select(getAllPosition));

  formGroup = new UntypedFormGroup({
    code: new UntypedFormControl(''),
    branch: new UntypedFormControl(),
    position: new UntypedFormControl(''),
  });

  constructor(
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(OrgchartActions.init());
    this.formGroup.valueChanges.pipe(debounceTime(1000)).subscribe((val) => {
      this.store.dispatch(
        OrgchartActions.searchBranch({
          branch: val.branch,
          position: val.position,
          code: val.code,
        })
      );
    });
    this.positions$ = searchAutocomplete(
      this.formGroup.get('position')?.valueChanges.pipe(startWith('')) ||
        of(''),
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
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.store.dispatch(OrgchartActions.deleteBranch({ id: $event.id }));
      }
    });
  }

  onEmployee(event: any) {
    this.router
      .navigate(['ho-so'], {
        queryParams: {
          branch: JSON.stringify(event),
        },
      })
      .then();
  }

  onPayroll(event: Branch) {
    this.store.dispatch(OrgchartActions.getBranch({ id: event.id }));
    this.store.dispatch(PayrollAction.updateStateBranch({ branch: event }));
    this.router.navigate(['phieu-luong']).then();
  }

  onOvertime(event: Branch) {
    this.store.dispatch(OrgchartActions.getBranch({ id: event.id }));
    this.store.dispatch(
      PayrollAction.updateStatePayroll({ filter: FilterTypeEnum.OVERTIME })
    );
    this.store.dispatch(PayrollAction.updateStateBranch({ branch: event }));
    this.router.navigate(['phieu-luong']).then();
  }

  onSelectPosition(positionName: string) {
    this.formGroup.get('position')?.patchValue(positionName);
  }

  onListPosition(event: any) {
    this.router
      .navigate(['to-chuc/chuc-vu'], {
        queryParams: {
          branchId: event.id,
        },
      })
      .then();
  }

  updateBranch($event: any) {
    this.dialog.open(DialogBranchComponent, {
      width: 'fit-content',
      data: { branch: $event, isUpdate: true },
    });
  }

  onEmployeePositionChip(item: any) {
    this.router
      .navigate(['ho-so'], {
        queryParams: {
          branch: JSON.stringify(item.branch),
          position: JSON.stringify(item.position),
        },
      })
      .then();
  }

  onPayrollPositionChip(item: any) {
    this.store.dispatch(OrgchartActions.getBranch({ id: item.branch.id }));
    this.store.dispatch(
      PayrollAction.updateStatePosition({ position: item.position })
    );
    this.store.dispatch(
      PayrollAction.updateStateBranch({ branch: item.branch })
    );
    this.router.navigate(['phieu-luong']).then();
  }

  onOvertimePositionChip(item: any) {
    this.store.dispatch(OrgchartActions.getBranch({ id: item.branch.id }));
    this.store.dispatch(
      PayrollAction.updateStatePosition({ position: item.position })
    );
    this.store.dispatch(
      PayrollAction.updateStateBranch({ branch: item.branch })
    );
    this.router
      .navigate(['phieu-luong'], {
        queryParams: {
          type: 'overtime',
        },
      })
      .then();
  }

  inputCheckNumber($event: any) {
    return checkInputNumber($event);
  }

  printBranch() {
    const val = this.formGroup.value;
    const branch = {
      name: val.branch,
      code: val.code,
      position: val.position,
    };
    this.dialog.open(DialogExportComponent, {
      width: 'fit-content',
      data: {
        title: 'Xu???t b???ng ????n v???',
        exportType: 'BRANCH',
        params: branch,
        api: Api.HR.BRANCH_EXPORT,
      },
    });
  }
}
