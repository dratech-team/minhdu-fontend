import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EmployeeStatusEnum,
  FlatSalaryTypeEnum,
  GenderTypeEnum,
  ItemContextMenu,
  ModeEnum,
  Role,
  sortEmployeeTypeEnum
} from '@minhdu-fontend/enums';
import { catchError, debounceTime } from 'rxjs/operators';
import { Api, EmployeeStatusConstant, GenderTypeConstant } from '@minhdu-fontend/constants';
import { throwError } from 'rxjs';
import { District, Employee, Sort, Ward } from '@minhdu-fontend/data-models';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ExportService } from '@minhdu-fontend/service';
import { Actions } from '@datorama/akita-ng-effects';
import {
  EmployeeActions,
  EmployeeEntity,
  EmployeeQuery,
  EmployeeService,
  EmployeeStore,
  SearchEmployeeDto
} from '@minhdu-fontend/employee-v2';
import { EmployeeTypeConstant } from '../../constants/employee-type.constant';
import { FlatSalaryTypeConstant } from '../../constants/flat-salary-type.constant';
import { ProvinceService } from '@minhdu-fontend/location';
import {
  BranchActions,
  BranchQuery,
  DepartmentActions,
  DepartmentQuery,
  PositionQuery
} from '@minhdu-fontend/orgchart-v2';
import { ModalEmployeeComponent } from '../../components/employee/modal-employee.component';
import { ModalEmployeeData } from '../../data/modal-employee.data';
import * as _ from 'lodash';
import {
  ModalAlertComponent,
  ModalDatePickerComponent,
  ModalExportExcelComponent,
  ModalExportExcelData
} from '@minhdu-fontend/components';
import { ModalAlertEntity, ModalDatePickerEntity } from '@minhdu-fontend/base-entity';
import { AccountQuery } from '../../../../../../../../libs/system/src/lib/state/account-management/account.query';

@Component({
  templateUrl: 'employee.component.html'
})
export class EmployeeComponent implements OnInit {
  total$ = this.employeeQuery.select((state) => state.total);
  remain$ = this.employeeQuery.select((state) => state.remain);
  count$ = this.employeeQuery.selectCount();
  loading$ = this.employeeQuery.select((state) => state.loading);
  positions$ = this.positionQuery.selectAll();
  branches$ = this.branchQuery.selectAll();
  provinces$ = this.provinceService.getAll();
  departments$ = this.departmentQuery.selectAll();
  currentUser$ = this.accountQuery.selectCurrentUser();

  stateEmployee = this.employeeQuery.getValue().search;

  employeeTypeConstant = EmployeeTypeConstant;
  genderTypeConstant = GenderTypeConstant;
  flatSalaryTypeConstant = FlatSalaryTypeConstant;
  empStatusContain = EmployeeStatusConstant;
  sortEnum = sortEmployeeTypeEnum;

  districts: District[] = this.stateEmployee.province?.districts || [];
  wards: Ward[] = this.stateEmployee.district?.wards || [];
  employees: EmployeeEntity[] = [];

  roleEnum = Role;
  modeEnum = ModeEnum;
  role = window.localStorage.getItem('role');
  genderType = GenderTypeEnum;
  ItemContextMenu = ItemContextMenu;
  empStatusEnum = EmployeeStatusEnum;
  valueSort = {
    orderBy: this.stateEmployee.orderBy,
    orderType: this.stateEmployee.orderType
  };

  departmentControl = new UntypedFormControl(
    this.stateEmployee.department || ''
  );
  formGroup = new UntypedFormGroup({
    name: new UntypedFormControl(this.stateEmployee.name),
    phone: new UntypedFormControl(this.stateEmployee.phone),
    identify: new UntypedFormControl(this.stateEmployee.phone),
    address: new UntypedFormControl(this.stateEmployee.address),
    province: new UntypedFormControl(this.stateEmployee.province || ''),
    district: new UntypedFormControl(this.stateEmployee.district || ''),
    ward: new UntypedFormControl(this.stateEmployee.ward || ''),
    gender: new UntypedFormControl(this.stateEmployee.gender),
    flatSalary: new UntypedFormControl(this.stateEmployee.flatSalary),
    position: new UntypedFormControl(this.stateEmployee.position || ''),
    branch: new UntypedFormControl(this.stateEmployee.branch || ''),
    type: new UntypedFormControl(this.stateEmployee.type),
    status: new UntypedFormControl(this.stateEmployee.status)
  });

  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    private readonly actions$: Actions,
    private readonly employeeQuery: EmployeeQuery,
    private readonly employeeStore: EmployeeStore,
    private readonly router: Router,
    private readonly activeRouter: ActivatedRoute,
    private readonly employeeService: EmployeeService,
    private readonly message: NzMessageService,
    private readonly modal: NzModalService,
    private readonly exportService: ExportService,
    private readonly positionQuery: PositionQuery,
    private readonly branchQuery: BranchQuery,
    private readonly provinceService: ProvinceService,
    private readonly departmentQuery: DepartmentQuery,
    private readonly accountQuery: AccountQuery
  ) {
    this.employeeQuery.selectAll().subscribe((item) => {
      this.employees = item;
    });
  }

  ngOnInit(): void {
    this.actions$.dispatch(BranchActions.loadAll({}));

    this.actions$.dispatch(DepartmentActions.loadAll({}));

    this.actions$.dispatch(
      EmployeeActions.loadAll(this.mapEmployeeDto(this.formGroup.value, false))
    );

    this.formGroup.valueChanges.pipe(debounceTime(1500)).subscribe((_) => {
      this.actions$.dispatch(
        EmployeeActions.loadAll(
          this.mapEmployeeDto(this.formGroup.value, false)
        )
      );
    });

    this.departmentControl.valueChanges.subscribe((_) => {
      this.actions$.dispatch(
        EmployeeActions.loadAll(
          this.mapEmployeeDto(this.formGroup.value, false)
        )
      );
    });

    this.formGroup.get('branch')?.valueChanges.subscribe((branch) => {
      if (branch) {
        this.actions$.dispatch(BranchActions.loadOne({ id: branch.id }));
      }
    });

    this.formGroup.get('province')?.valueChanges.subscribe((province) => {
      this.formGroup.get('district')?.setValue('');
      this.formGroup.get('ward')?.setValue('');
      this.districts = province?.districts || [];
    });

    this.formGroup.get('district')?.valueChanges.subscribe((district) => {
      this.formGroup.get('ward')?.setValue('');
      this.wards = district?.wards || [];
    });
  }

  onDetail(employee: EmployeeEntity) {
    this.router.navigate(['nhan-vien/chi-tiet-nhan-vien', employee.id]).then();
  }

  onAdd(employeeInit?: EmployeeEntity): void {
    this.modal.create({
      nzTitle: 'Th??m nh??n vi??n',
      nzWidth: '700px',
      nzContent: ModalEmployeeComponent,
      nzComponentParams: <{ data: ModalEmployeeData }>{
        data: {
          add: employeeInit
        }
      },
      nzFooter: []
    });
  }

  onDelete(employee: EmployeeEntity): void {
    this.modal
      .create({
        nzTitle: `Nh??n vi??n ${employee.lastName} ${
          this.formGroup.value.empStatus === EmployeeStatusEnum.NOT_ACTIVE
            ? 'ngh??? vi???c'
            : 't???m th???i ngh??? vi???c'
        }`,
        nzContent: ModalDatePickerComponent,
        nzComponentParams: <{ data: ModalDatePickerEntity }>{
          data: {
            type: 'date',
            dateInit: new Date()
          }
        },
        nzFooter: []
      })
      .afterClose.subscribe((val) => {
      if (val) {
        this.actions$.dispatch(
          this.formGroup.value.status === EmployeeStatusEnum.NOT_ACTIVE
            ? EmployeeActions.remove({ id: employee.id })
            : EmployeeActions.leave({
              id: employee.id,
              body: { leftAt: new Date(val) }
            })
        );
      }
    });
  }

  mapEmployeeDto(val: any, isPagination: boolean): SearchEmployeeDto {
    this.employeeStore.update((state) => ({
      ...state,
      search: Object.assign(
        JSON.parse(JSON.stringify(val)),
        { department: this.departmentControl.value },
        this.valueSort
      )
    }));
    return {
      search: {
        name: val.name,
        phone: val.phone,
        identify: val.identify,
        address: val.address,
        province: val.province?.name || '',
        district: val.district?.name || '',
        ward: val.ward?.name || '',
        gender: val.gender,
        position: val.position ? val.position.name : '',
        branch: val.branch ? val.branch.name : '',
        status: val.status,
        type: val.type,
        isFlatSalary: val.flatSalary as FlatSalaryTypeEnum,
        categoryId: this.departmentControl.value
          ? this.departmentControl.value.id
          : '',
        orderBy: this.valueSort?.orderBy || '',
        orderType: this.valueSort?.orderType || ''
      },
      isSet: isPagination
    };
  }

  onLoadMore() {
    this.actions$.dispatch(
      EmployeeActions.loadAll(this.mapEmployeeDto(this.formGroup.value, true))
    );
  }

  onUpdate(employee: EmployeeEntity): void {
    this.modal.create({
      nzWidth: '700px',
      nzTitle: 'C???p nh???t nh??n vi??n',
      nzContent: ModalEmployeeComponent,
      nzComponentParams: <{ data: ModalEmployeeData }>{
        data: {
          update: {
            employee
          }
        }
      },
      nzFooter: []
    });
  }

  onPrint() {
    this.modal.create({
      nzTitle: 'Xu???t danh s??ch nh??n vi??n',
      nzWidth: 'fit-content',
      nzContent: ModalExportExcelComponent,
      nzComponentParams: <{ data: ModalExportExcelData }>{
        data: {
          filename: 'Danh s??ch nh??n vi??n',
          params: Object.assign(
            {},
            _.omit(this.mapEmployeeDto(this.formGroup.value, false).search, [
              'take',
              'skip'
            ]),
            { exportType: 'EMPLOYEES' }
          ),
          api: Api.HR.EMPLOYEE.EMPLOYEE_EXPORT
        }
      },
      nzFooter: []
    });
  }

  onRestore(employee: EmployeeEntity) {
    this.modal
      .create({
        nzTitle: `Kh??i ph???c nh??n vi??n ${employee.lastName}`,
        nzContent: ModalAlertComponent,
        nzComponentParams: <{ data: ModalAlertEntity }>{
          data: {
            description: `B???n c?? ch???c ch???n mu???n kh??i ph???c cho nh??n vi??n ${employee.lastName}`
          }
        },
        nzFooter: []
      })
      .afterClose.subscribe((val) => {
      if (val) {
        this.actions$.dispatch(
          EmployeeActions.leave({
            id: employee.id,
            body: { leftAt: '' }
          })
        );
      }
    });
  }

  onDrop(event: CdkDragDrop<Employee[]>) {
    moveItemInArray(this.employees, event.previousIndex, event.currentIndex);
    const sort = this.employees.map((employee, i) => ({
      id: employee.id,
      stt: i + 1
    }));
    this.employeeService
      .sort({ sort: sort })
      .pipe(
        catchError((err) => {
          moveItemInArray(
            this.employees,
            event.currentIndex,
            event.previousIndex
          );
          return throwError(err);
        })
      )
      .subscribe();
  }

  onSort(sort: Sort) {
    this.valueSort = sort;
    this.actions$.dispatch(
      EmployeeActions.loadAll(this.mapEmployeeDto(this.formGroup.value, false))
    );
  }
}
