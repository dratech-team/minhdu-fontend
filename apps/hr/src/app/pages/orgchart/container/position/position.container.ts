import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { OrgchartEnum, PayrollEnum } from '@minhdu-fontend/enums';
import { MatDialog } from '@angular/material/dialog';
import {
  getAllPosition,
  getPositionLoaded,
  PositionActions
} from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { DialogPositionComponent } from '../../component/dialog-position/dialog-position.component';
import { PageTypeEnum } from '../../../../../../../../libs/enums/sell/page-type.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { PayrollAction } from '../../../payroll/+state/payroll/payroll.action';
import { getBranchById, getOrgchartLoaded, OrgchartActions } from '@minhdu-fontend/orgchart';
import { Observable } from 'rxjs';
import { Branch } from '@minhdu-fontend/data-models';

@Component({
  templateUrl: 'position.container.html'
})
export class PositionContainer implements OnInit {
  branchId: number | undefined = undefined;
  branch$!: Observable<Branch | undefined>;
  branchLoaded$ = this.store.pipe(select(getOrgchartLoaded));
  positionLoaded$ = this.store.pipe(select(getPositionLoaded));
  position$ = this.store.pipe(select(getAllPosition));
  type = OrgchartEnum;
  pageType = PageTypeEnum;
  pageSize = 30;
  pageIndexInit = 0;
  positions = new FormControl();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly activeRouter: ActivatedRoute,
    private readonly store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.activeRouter.queryParams.subscribe(val => {
      if (val.branchId) {
        this.branchId = val.branchId;
        if (this.branchId) {
          this.branch$ = this.store.select(getBranchById(this.branchId));
          this.store.dispatch(OrgchartActions.getBranch({ id: this.branchId }));
        }
      } else {
        this.branchId = undefined;
        this.store.dispatch(PositionActions.loadPosition());
      }
    });

    this.positions.valueChanges.pipe(debounceTime(1000)).subscribe(val => {
      this.store.dispatch(PositionActions.searchPosition({ position: val }));
    });
  }


  addPosition() {
    this.dialog.open(DialogPositionComponent, { width: 'fit-content', data: { branchId: this.branchId } });
  }

  updatePosition($event: any) {
    this.dialog.open(DialogPositionComponent, {
      width: 'fit-content', data:
        { position: $event, isUpdate: true, branchId: this.branchId }
    });
  }

  deletePosition($event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, { width: '30%' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(PositionActions.deletePosition({
          id: $event.position.id,
          branchId: this.branchId ? this.branchId : undefined
        }));
      }
    });
  }

  onEmployee(event: any) {
    this.router.navigate(['ho-so'], {
      queryParams: {
        position: event.position.name,
        branch: event.branch ? event.branch.name : ''
      }
    }).then();
  }

  onPayroll(event: any) {
    this.store.dispatch(PayrollAction.updateStatePayroll(
      { position: event.position.name, branch: event.branch ? event.branch.name : '' }));
    this.router.navigate(['phieu-luong']).then();
  }

  onOvertime(event: any) {
    this.store.dispatch(PayrollAction.updateStatePayroll(
      {
        position: event.position.name, branch:
          event.branch ? event.branch.name : '',
        filter: PayrollEnum.PAYROLL_OVERTIME
      }));
    this.router.navigate(['phieu-luong']).then();
  }
}
