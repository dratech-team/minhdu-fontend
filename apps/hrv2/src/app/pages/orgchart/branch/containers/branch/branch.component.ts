import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, map } from 'rxjs/operators';
import { Actions } from '@datorama/akita-ng-effects';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  BranchActions,
  BranchEntity,
  BranchQuery,
  BranchStore,
  PositionActions,
  PositionEntity,
  PositionQuery,
  PositionStore,
} from '@minhdu-fontend/orgchart-v2';
import { ActivatedRoute, Router } from '@angular/router';
import { PayrollStore } from '../../../../payroll/state';
import { EmployeeStore } from '@minhdu-fontend/employee-v2';
import {
  FilterTypeEnum,
  ItemContextMenu,
  ModeEnum,
} from '@minhdu-fontend/enums';
import { ModalBranchComponent } from '../../components/modal-branch/modal-branch.component';
import { DataAddOrUpBranch } from '../../data/modal-department.data';
import { AccountQuery } from '../../../../../../../../../libs/system/src/lib/state/account-management/account.query';

@Component({
  templateUrl: 'branch.component.html',
})
export class BranchComponent implements OnInit {
  branches$ = this.branchQuery.selectAll();
  loading$ = this.branchQuery.select((state) => state.loading);
  total$ = this.branchQuery.select((state) => state.total);
  positions$ = this.positionQuery.selectAll();
  currentUser$ = this.accountQuery.selectCurrentUser();

  pageSizeTable = 10;
  filterType = FilterTypeEnum;
  itemContextMenu = ItemContextMenu;
  modeEnum = ModeEnum;
  stateSearch = this.branchQuery.getValue().search;
  formGroup = new UntypedFormGroup({
    search: new UntypedFormControl(this.stateSearch.name),
    position: new UntypedFormControl(this.stateSearch.position || ''),
  });

  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService,
    private readonly branchQuery: BranchQuery,
    private readonly branchStore: BranchStore,
    private readonly payrollStore: PayrollStore,
    private readonly employeeStore: EmployeeStore,
    private readonly positionStore: PositionStore,
    private readonly positionQuery: PositionQuery,
    private readonly router: Router,
    private readonly activeRouter: ActivatedRoute,
    private readonly accountQuery: AccountQuery
  ) {}

  ngOnInit() {
    this.actions$.dispatch(PositionActions.loadAll({}));
    this.actions$.dispatch(
      BranchActions.loadAll({
        search: this.mapBranch(this.formGroup.value, false),
      })
    );

    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        map((value) => {
          this.actions$.dispatch(
            BranchActions.loadAll({
              search: this.mapBranch(this.formGroup.value, false),
            })
          );
        })
      )
      .subscribe();
  }

  onLoadMore() {
    this.actions$.dispatch(
      BranchActions.loadAll({
        search: this.mapBranch(this.formGroup.value, true),
        isSet: true,
      })
    );
  }

  mapBranch(dataFG: any, isPagination: boolean) {
    this.branchStore.update((state) => ({
      ...state,
      search: dataFG,
    }));
    return Object.assign({}, dataFG, {
      position: dataFG.position?.name || '',
    });
  }

  onAdd() {
    this.modal.create({
      nzWidth: '30vw',
      nzTitle: 'Th??m ????n v???',
      nzContent: ModalBranchComponent,
      nzFooter: [],
    });
  }

  onUpdate(branch: BranchEntity) {
    this.modal.create({
      nzWidth: '30vw',
      nzTitle: 'C???p nh???t ????n v???',
      nzContent: ModalBranchComponent,
      nzComponentParams: <{ data?: DataAddOrUpBranch }>{
        data: {
          update: {
            branch: branch,
          },
        },
      },
      nzFooter: [],
    });
  }

  onDelete(branch: BranchEntity) {
    this.modal.warning({
      nzTitle: `Xo?? ????n v??? ${branch.name}`,
      nzContent: `B???n c?? ch???c ch???n mu???n xo?? ????n v??? ${branch.name} n??y kh??ng`,
      nzOkDanger: true,
      nzOnOk: () =>
        this.actions$.dispatch(BranchActions.remove({ id: branch.id })),
      nzFooter: [],
    });
  }

  onDetail(branch: BranchEntity) {
    this.router
      .navigate(['to-chuc/don-vi/chi-tiet-don-vi/', branch.id], {
        queryParams: {
          mode: localStorage.getItem('mode'),
        },
      })
      .then();
  }

  onEmployee(branch: BranchEntity, position?: PositionEntity) {
    this.positionStore.add(branch.positions || []);
    this.employeeStore.update((state) => ({
      ...state,
      search: Object.assign(
        JSON.parse(JSON.stringify(state.search)),
        { branch: branch },
        position ? { position: position } : {}
      ),
    }));
    this.router.navigate(['nhan-vien']).then();
  }

  onPayroll(
    branch: BranchEntity,
    filterType: FilterTypeEnum,
    position?: PositionEntity
  ) {
    this.positionStore.add(branch.positions || []);
    this.payrollStore.update((state) => ({
      ...state,
      search: Object.assign(
        JSON.parse(JSON.stringify(state.search)),
        {
          branch: branch,
          filterType: filterType,
        },
        position ? { position: position } : {}
      ),
    }));
    this.router.navigate(['phieu-luong']).then();
  }
}
