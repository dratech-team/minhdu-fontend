import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import {
  FilterTypeEnum,
  ItemContextMenu,
  OrgchartEnum,
} from '@minhdu-fontend/enums';
import { MatDialog } from '@angular/material/dialog';
import {
  getAllPosition,
  getPositionLoaded,
  PositionActions,
} from '@minhdu-fontend/orgchart-position';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { DialogPositionComponent } from '../../component/dialog-position/dialog-position.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PayrollAction } from '../../../payroll/+state/payroll/payroll.action';
import {
  getBranchById,
  getOrgchartLoaded,
  OrgchartActions,
} from '@minhdu-fontend/orgchart';
import { Observable } from 'rxjs';
import { Branch, Position } from '@minhdu-fontend/data-models';
import { DialogExportComponent } from '@minhdu-fontend/components';
import { Api } from '@minhdu-fontend/constants';

@Component({
  templateUrl: 'position.container.html',
})
export class PositionContainer implements OnInit {
  branchId: number | undefined = undefined;
  branch$!: Observable<Branch | undefined>;
  branchLoaded$ = this.store.pipe(select(getOrgchartLoaded));
  positionLoaded$ = this.store.pipe(select(getPositionLoaded));
  position$ = this.store.pipe(select(getAllPosition));
  type = OrgchartEnum;
  ItemContextMenu = ItemContextMenu;
  pageSize = 30;
  pageIndexInit = 0;
  positions = new UntypedFormControl();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly activeRouter: ActivatedRoute,
    private readonly store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.activeRouter.queryParams.subscribe((val) => {
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

    this.positions.valueChanges.pipe(debounceTime(1000)).subscribe((val) => {
      this.store.dispatch(PositionActions.searchPosition({ position: val }));
    });
  }

  addPosition() {
    this.dialog.open(DialogPositionComponent, {
      width: 'fit-content',
      data: { branchId: this.branchId },
    });
  }

  updatePosition($event: Position) {
    this.dialog.open(DialogPositionComponent, {
      width: 'fit-content',
      data: { position: $event, isUpdate: true, branchId: this.branchId },
    });
  }

  deletePosition($event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, { width: '30%' });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.store.dispatch(
          PositionActions.deletePosition({
            id: $event.position.id,
            branchId: this.branchId ? this.branchId : undefined,
          })
        );
      }
    });
  }

  onEmployee(event: any) {
    this.router
      .navigate(['ho-so'], {
        queryParams: {
          position: event.position.name,
          branch: event.branch ? event.branch.name : '',
        },
      })
      .then();
  }

  onPayroll(event: any) {
    if (event.branch) {
      this.store.dispatch(OrgchartActions.getBranch({ id: event.branch.id }));
    }
    this.store.dispatch(
      PayrollAction.updateStateBranch({ branch: event.branch })
    );
    this.store.dispatch(
      PayrollAction.updateStatePosition({ position: event.position })
    );
    this.router.navigate(['phieu-luong']).then();
  }

  onOvertime(event: any) {
    if (event.branch) {
      this.store.dispatch(OrgchartActions.getBranch({ id: event.branch.id }));
      this.store.dispatch(
        PayrollAction.updateStateBranch({ branch: event.branch })
      );
    }
    this.store.dispatch(
      PayrollAction.updateStatePayroll({ filter: FilterTypeEnum.OVERTIME })
    );
    this.store.dispatch(
      PayrollAction.updateStatePosition({ position: event.position })
    );
    this.router.navigate(['phieu-luong']).then();
  }

  printPosition() {
    this.dialog.open(DialogExportComponent, {
      width: 'fit-content',
      data: {
        title: 'Xu???t b???ng ch???c v???',
        exportType: 'POSITION',
        params: this.branchId ? { branchId: this.branchId } : undefined,
        api: Api.HR.POSITION_EXPORT,
      },
    });
  }
}
