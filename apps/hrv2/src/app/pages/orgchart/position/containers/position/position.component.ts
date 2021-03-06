import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, map } from 'rxjs/operators';
import { Actions } from '@datorama/akita-ng-effects';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  BranchEntity,
  DepartmentActions,
  PositionActions,
  PositionEntity,
  PositionQuery,
} from '@minhdu-fontend/orgchart-v2';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalPositionComponent } from '../../components/modal-position/modal-position.component';
import { DataAddOrUpdatePosition } from '../../data/modal-position.data';
import {
  FilterTypeEnum,
  ItemContextMenu,
  ModeEnum,
} from '@minhdu-fontend/enums';
import { EmployeeStore } from '@minhdu-fontend/employee-v2';
import { PayrollStore } from '../../../../payroll/state';
import { AccountQuery } from '../../../../../../../../../libs/system/src/lib/state/account-management/account.query';

@Component({
  templateUrl: 'position.component.html',
})
export class PositionComponent implements OnInit {
  positions$ = this.positionQuery.selectAll();
  loading$ = this.positionQuery.select((state) => state.loading);
  total$ = this.positionQuery.select((state) => state.total);
  currentUser$ = this.accountQuery.selectCurrentUser();

  stateSearch = this.positionQuery.getValue().search;
  itemContextMenu = ItemContextMenu;
  FilterTypeEnum = FilterTypeEnum;
  modeEnum = ModeEnum;
  formGroup = new UntypedFormGroup({
    search: new UntypedFormControl(this.stateSearch.search),
  });

  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService,
    private readonly positionQuery: PositionQuery,
    private readonly employeeStore: EmployeeStore,
    private readonly payrollStore: PayrollStore,
    private readonly router: Router,
    private readonly activeRouter: ActivatedRoute,
    private readonly accountQuery: AccountQuery
  ) {}

  ngOnInit() {
    this.actions$.dispatch(
      PositionActions.loadAll({
        search: this.formGroup.value,
      })
    );

    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        map((value) => {
          this.actions$.dispatch(
            DepartmentActions.loadAll({
              search: this.formGroup.value,
            })
          );
        })
      )
      .subscribe();
  }

  onLoadMore() {
    this.actions$.dispatch(
      DepartmentActions.loadAll({
        search: this.formGroup.value,
        isSet: true,
      })
    );
  }

  onAdd() {
    this.modal.create({
      nzWidth: 'fit-content',
      nzTitle: 'T???o ph??ng ban',
      nzContent: ModalPositionComponent,
      nzFooter: [],
    });
  }

  onUpdate(position: PositionEntity) {
    this.modal.create({
      nzWidth: 'fit-content',
      nzTitle: 'C???p nh???t ch???c v???',
      nzContent: ModalPositionComponent,
      nzComponentParams: <{ data?: DataAddOrUpdatePosition }>{
        data: {
          update: {
            position: position,
          },
        },
      },
      nzFooter: [],
    });
  }

  onDelete(position: PositionEntity) {
    this.modal.warning({
      nzTitle: `Xo?? ch???c v??? ${position.name}`,
      nzContent: `B???n c?? ch???c ch???n mu???n xo?? ch???c v??? ${position.name} n??y kh??ng`,
      nzOkDanger: true,
      nzOnOk: () =>
        this.actions$.dispatch(PositionActions.remove({ id: position.id })),
      nzFooter: [],
    });
  }

  onEmployee(position: PositionEntity, branch?: BranchEntity) {
    this.employeeStore.update((state) => ({
      ...state,
      search: Object.assign(
        JSON.parse(JSON.stringify(state.search)),
        {
          position: position,
        },
        branch ? { branch: branch } : {}
      ),
    }));
    this.router.navigate(['nhan-vien']).then();
  }

  /// FIXME: Check event again
  onRoute(
    event: any,
    type?: FilterTypeEnum,
  ) {
    this.payrollStore.update((state) => ({
      ...state,
      search: Object.assign(
        JSON.parse(JSON.stringify(state.search)),
        {
          position: event?.position,
          filterType: type,
        },
         { branch: event?.branch }
      ),
    }));
    this.router.navigate(['phieu-luong']).then();
  }
}
