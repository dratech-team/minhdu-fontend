import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {debounceTime, map} from 'rxjs/operators';
import {Actions} from '@datorama/akita-ng-effects';
import {NzModalService} from 'ng-zorro-antd/modal';
import {DepartmentActions, DepartmentEntity, DepartmentQuery} from "@minhdu-fontend/orgchart-v2";
import {ModalDepartmentComponent} from "../../components/modal-department/modal-department.component";
import {DataAddOrUpdateDepartment} from "../../data/modal-department.data";
import {ModalAlertComponent} from "@minhdu-fontend/components";
import {ModalAlertEntity} from "@minhdu-fontend/base-entity";
import {ActivatedRoute, Router} from "@angular/router";
import {EmployeeStore} from "@minhdu-fontend/employee-v2";
import {PayrollStore} from "../../../../payroll/state";
import {FilterTypeEnum, ItemContextMenu, ModeEnum} from "@minhdu-fontend/enums";
import {AccountQuery} from "../../../../../../../../../libs/system/src/lib/state/account-management/account.query";

@Component({
  templateUrl: 'department.component.html'
})
export class DepartmentComponent implements OnInit {
  departments$ = this.departmentQuery.selectAll()
  loading$ = this.departmentQuery.select(state => state.loading)
  total$ = this.departmentQuery.select(state => state.total)
  currentUser$ = this.accountQuery.selectCurrentUser$

  pageSizeTable = 10;
  itemContext = ItemContextMenu
  filterTypeEnum = FilterTypeEnum
  modeEnum = ModeEnum
  formGroup = new FormGroup(
    {
      search: new FormControl(''),
    }
  );

  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService,
    private readonly departmentQuery: DepartmentQuery,
    private readonly employeeStore: EmployeeStore,
    private readonly payrollStore: PayrollStore,
    private readonly router: Router,
    private readonly activeRouter: ActivatedRoute,
    private readonly accountQuery: AccountQuery,
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(DepartmentActions.loadAll({
      search: this.formGroup.value
    }));
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      map(value => {
          this.actions$.dispatch(DepartmentActions.loadAll({
            search: this.formGroup.value
          }));
        }
      )
    ).subscribe();
  }

  onLoadMore() {
    this.actions$.dispatch(DepartmentActions.loadAll({
      search: this.formGroup.value,
      isPaginate: true
    }));
  }

  onAdd(department?: DepartmentComponent) {
    this.modal.create({
      nzWidth: 'fit-content',
      nzTitle: 'Tạo phòng ban',
      nzContent: ModalDepartmentComponent,
      nzComponentParams: <{ data?: DataAddOrUpdateDepartment }>{
        data: {
          add: {
            category: department
          }
        }
      },
      nzFooter: [],
    })
  }

  onUpdate(department: DepartmentEntity) {
    this.modal.create({
      nzWidth: 'fit-content',
      nzTitle: 'Cập nhật phòng ban',
      nzContent: ModalDepartmentComponent,
      nzComponentParams: <{ data?: DataAddOrUpdateDepartment }>{
        data: {
          update: {
            department: department
          }
        }
      },
      nzFooter: [],
    })
  }

  onDelete(department: DepartmentEntity) {
    this.modal.create({
      nzTitle: `Xoá phòng ban ${department.name}`,
      nzContent: ModalAlertComponent,
      nzComponentParams: <{ data: ModalAlertEntity }>{
        data: {
          description: `Bạn có chắc chắn muốn xoá phòng ban ${department.name} này không`
        }
      },
      nzFooter: []
    }).afterClose.subscribe(val => {
      if (val) {
        this.actions$.dispatch(DepartmentActions.remove({id: department.id}))
      }
    })
  }

  onEmployee(department: DepartmentEntity) {
    this.employeeStore.update(state => ({
      ...state, search: Object.assign(JSON.parse(JSON.stringify(state.search)), {department: department})
    }))
    this.router.navigate(['nhan-vien']).then();
  }

  onPayroll(department: DepartmentEntity, filterType: FilterTypeEnum) {
    this.payrollStore.update(state => ({
      ...state, search: Object.assign(JSON.parse(JSON.stringify(state.search)),
        {
          filterType: filterType,
          department: department
        })
    }))
    this.router.navigate(['phieu-luong']).then();
  }
}
