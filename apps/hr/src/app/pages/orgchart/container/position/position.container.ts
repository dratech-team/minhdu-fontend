import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { OrgchartEnum } from '@minhdu-fontend/enums';
import { MatDialog } from '@angular/material/dialog';
import {
  getAllPosition,
  PositionActions, selectPositionLoaded
} from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { DialogPositionComponent } from '../../component/dialog-position/dialog-position.component';
import { PageTypeEnum } from '../../../../../../../../libs/enums/sell/page-type.enum';
import { EmployeeAction } from '@minhdu-fontend/employee';
import { ActivatedRoute, Router } from '@angular/router';
import { PayrollAction } from '../../../payroll/+state/payroll/payroll.action';
import { getBranchById, getOrgchartLoaded, getSelectedBranchId, OrgchartActions } from '@minhdu-fontend/orgchart';

@Component({
  templateUrl: 'position.container.html'
})
export class PositionContainer implements OnInit {
  branch$ = this.store.select(getBranchById(this.branchId))
  positionLoaded$ = this.store.pipe(select(getOrgchartLoaded));
  type = OrgchartEnum;
  pageType = PageTypeEnum;
  pageSize = 30;
  pageIndexInit = 0;
  positions = new FormControl();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.store.dispatch(OrgchartActions.getBranch({id: this.branchId}));
    this.positions.valueChanges.pipe(debounceTime(1000)).subscribe(val => {
      this.store.dispatch(PositionActions.searchPosition({ position: val }));
    });
  }


  addPosition() {
    this.dialog.open(DialogPositionComponent, { width: 'fit-content', data: {branchId: this.branchId} });
  }

  updatePosition($event: any) {
    this.dialog.open(DialogPositionComponent, { width: 'fit-content', data:
        { position: $event, isUpdate: true,branchId: this.branchId } });
  }

  get branchId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  deletePosition($event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, { width: '30%' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(PositionActions.deletePosition({ id: $event.id, branchId: this.branchId }));
      }
    });
  }

  onEmployee(event: any){
    this.router.navigate(['ho-so'], {
      queryParams:{
        position: event.name
      }
    }).then()
  }

  onPayroll(event: any){
    this.store.dispatch(PayrollAction.updateStatePayroll({position: event.name}))
    this.router.navigate(['phieu-luong']).then()
  }

  onOvertime(event: any){
    this.store.dispatch(PayrollAction.updateStatePayroll({position: event.name}))
    this.router.navigate(['phieu-luong'], {
      queryParams:{
        type:'overtime'
      }
    }).then()
  }
}
