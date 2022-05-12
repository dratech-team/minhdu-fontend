import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {EmployeeStatusEnum, Gender, ItemContextMenu, Role, sortEmployeeTypeEnum} from '@minhdu-fontend/enums';
import {catchError, debounceTime} from 'rxjs/operators';
import {Api, EmployeeStatusConstant, GenderTypeConstant, PaginationDto} from '@minhdu-fontend/constants';
import {throwError} from 'rxjs';
import {District, Employee, Sort, Ward} from '@minhdu-fontend/data-models';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {ExportService} from "@minhdu-fontend/service";
import {Actions} from "@datorama/akita-ng-effects";
import {
  EmployeeActions,
  EmployeeEntity,
  EmployeeQuery,
  EmployeeService,
  EmployeeStore,
  SearchEmployeeDto
} from "@minhdu-fontend/employee-v2";
import {EmployeeTypeConstant} from "../../constants/employee-type.constant";
import {FlatSalaryTypeConstant} from "../../constants/flat-salary-type.constant";
import {ProvinceService} from "@minhdu-fontend/location";
import {FlatSalaryTypeEnum} from "../../enums/flat-salary-type.enum";
import {
  BranchActions,
  BranchQuery,
  DepartmentActions,
  DepartmentQuery,
  PositionQuery
} from "@minhdu-fontend/orgchart-v2";
import {ModalEmployeeComponent} from "../../components/employee/modal-employee.component";
import {ModalEmployeeData} from "../../data/modal-employee.data";
import * as _ from "lodash";
import {
  ModalExportExcelComponent
} from "../../../../../../../../libs/components/src/lib/modal-export/modal-export-excel.component";
import {ModalExportExcelData} from "../../../../../../../../libs/components/src/lib/data/modal-export-excel.data";

@Component({
  templateUrl: 'employee.component.html'
})
export class EmployeeComponent implements OnInit {
  total$ = this.employeeQuery.select(state => state.total)
  loading$ = this.employeeQuery.select(state => state.loading)
  positions$ = this.positionQuery.selectAll()
  branches$ = this.branchQuery.selectAll()
  provinces$ = this.provinceService.getAll()
  departments$ = this.departmentQuery.selectAll();

  stateEmployee = this.employeeQuery.getValue().search

  employeeTypeConstant = EmployeeTypeConstant
  genderTypeConstant = GenderTypeConstant
  flatSalaryTypeConstant = FlatSalaryTypeConstant
  empStatusContain = EmployeeStatusConstant;
  sortEnum = sortEmployeeTypeEnum;

  districts: District[] = this.stateEmployee.province?.districts || []
  wards: Ward[] = this.stateEmployee.district?.wards || []
  employees: EmployeeEntity[] = []

  roleEnum = Role;
  role = window.localStorage.getItem('role')
  genderType = Gender;
  ItemContextMenu = ItemContextMenu;
  pageSize = 15
  empStatusEnum = EmployeeStatusEnum
  valueSort = {
    orderBy: this.stateEmployee.orderBy,
    orderType: this.stateEmployee.orderType
  };

  departmentControl = new FormControl(this.stateEmployee.department || '');
  formGroup = new FormGroup({
    name: new FormControl(this.stateEmployee.name),
    phone: new FormControl(this.stateEmployee.phone),
    identify: new FormControl(this.stateEmployee.phone),
    address: new FormControl(this.stateEmployee.address),
    province: new FormControl(this.stateEmployee.province || ''),
    district: new FormControl(this.stateEmployee.district || ''),
    ward: new FormControl(this.stateEmployee.ward || ''),
    gender: new FormControl(this.stateEmployee.gender),
    flatSalary: new FormControl(this.stateEmployee.flatSalary),
    position: new FormControl(this.stateEmployee.position || ''),
    branch: new FormControl(this.stateEmployee.branch || ''),
    employeeType: new FormControl(this.stateEmployee.employeeType),
    status: new FormControl(this.stateEmployee.status)
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
    private readonly departmentQuery: DepartmentQuery
  ) {
    this.employeeQuery.selectAll().subscribe(item => {
      this.employees = item
    })
  }

  ngOnInit(): void {
    this.actions$.dispatch(BranchActions.loadAll({}));

    this.actions$.dispatch(DepartmentActions.loadAll({}))

    this.actions$.dispatch(
      EmployeeActions.loadAll(this.mapEmployeeDto(this.formGroup.value, false))
    );

    this.formGroup.valueChanges
      .pipe(debounceTime(1500))
      .subscribe(_ => {
        this.actions$.dispatch(EmployeeActions.loadAll(this.mapEmployeeDto(this.formGroup.value, false)));
      });

    this.departmentControl.valueChanges.subscribe(_ => {
      this.actions$.dispatch(EmployeeActions.loadAll(this.mapEmployeeDto(this.formGroup.value, false)));
    });

    this.formGroup.get('branch')?.valueChanges.subscribe(branch => {
      if (branch) {
        this.actions$.dispatch(BranchActions.loadOne({id: branch.id}))
      }
    });

    this.formGroup.get('province')?.valueChanges.subscribe(province => {
      this.formGroup.get('district')?.setValue('')
      this.formGroup.get('ward')?.setValue('')
      this.districts = province?.districts || []
    });

    this.formGroup.get('district')?.valueChanges.subscribe(district => {
      this.formGroup.get('ward')?.setValue('')
      this.wards = district?.wards || []
    });
  }

  onAdd(employeeInit?: EmployeeEntity): void {
    this.modal.create({
      nzTitle: 'Thêm nhân viên',
      nzWidth: '700px',
      nzContent: ModalEmployeeComponent,
      nzComponentParams: <{ data: ModalEmployeeData }>{
        data: {
          add: employeeInit
        }
      },
      nzFooter: []
    })
  }

  onDelete(employeeId: any): void {
  }

  mapEmployeeDto(val: any, isPagination: boolean): SearchEmployeeDto {
    this.employeeStore.update(state => ({
      ...state, search: Object.assign(JSON.parse(JSON.stringify(val)),
        {department: this.departmentControl.value},
        this.valueSort
      )
    }))
    return {
      search: {
        take: PaginationDto.take,
        skip: isPagination ? this.employeeQuery.getCount() : PaginationDto.skip,
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
        employeeType: val.employeeType,
        isFlatSalary: val.flatSalary as FlatSalaryTypeEnum,
        categoryId: this.departmentControl.value ? this.departmentControl.value.id : '',
        orderBy: this.valueSort?.orderBy || '',
        orderType: this.valueSort?.orderType || '',
      },
      isPaginate: isPagination
    };
  }

  onPagination(index: number) {
    if (index * this.pageSize >= this.employeeQuery.getCount()) {
      this.actions$.dispatch(EmployeeActions.loadAll(this.mapEmployeeDto(this.formGroup.value, true)))
    }
  }

  onUpdate($event: any, isUpdate?: boolean): void {
    this.router.navigate(['nhan-vien/chi-tiet-nhan-vien', $event.id], {
      queryParams: {
        isUpdate
      }
    }).then();
  }

  onPermanentlyDeleted($event: any) {
  }

  onPrint() {
    this.modal.create({
      nzTitle: 'Xuất danh sách nhân viên',
      nzWidth: 'fit-content',
      nzContent: ModalExportExcelComponent,
      nzComponentParams: <{ data: ModalExportExcelData }>{
        data: {
          filename: 'Danh sách nhân viên',
          params: Object.assign({},
            _.omit(this.mapEmployeeDto(this.formGroup.value, false).search, ['take', 'skip']),
            {exportType: 'EMPLOYEES'}),
          api: Api.HR.EMPLOYEE.EMPLOYEE_EXPORT
        }
      },
      nzFooter: []
    })
  }

  onRestore($event: any) {
  }

  onDrop(event: CdkDragDrop<Employee[]>) {
    moveItemInArray(this.employees, event.previousIndex, event.currentIndex);
    const sort = this.employees.map((employee, i) => ({id: employee.id, stt: i + 1}));
    this.employeeService.sort({sort: sort}).pipe(
      catchError(err => {
        moveItemInArray(this.employees, event.currentIndex, event.previousIndex);
        return throwError(err);
      })
    ).subscribe();
  }

  onSort(sort: Sort) {
    this.valueSort = sort;
    this.actions$.dispatch(
      EmployeeActions.loadAll(this.mapEmployeeDto(this.formGroup.value, false))
    );
  }
}
