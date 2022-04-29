import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {
  EmployeeStatusEnum,
  EmployeeType,
  Gender,
  ItemContextMenu,
  Role,
  SearchEmployeeType,
  sortEmployeeTypeEnum
} from '@minhdu-fontend/enums';
import {catchError, debounceTime, tap} from 'rxjs/operators';
import {EmployeeStatusConstant, GenderTypeConstant, PaginationDto} from '@minhdu-fontend/constants';
import {Observable, throwError} from 'rxjs';
import {Category, District, Employee, Ward} from '@minhdu-fontend/data-models';
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
  EmployeeStore
} from "@minhdu-fontend/employee-v2";
import {EmployeeTypeConstant} from "../../constants/employee-type.constant";
import {FlatSalaryTypeConstant} from "../../constants/flat-salary-type.constant";
import {ProvinceService} from "@minhdu-fontend/location";
import {FlatSalaryTypeEnum} from "../../enums/flat-salary-type.enum";
import {BranchActions, BranchQuery, PositionQuery} from "@minhdu-fontend/orgchart-v2";
import {SearchEmployeeDto} from "@minhdu-fontend/employee-v2";

@Component({
  templateUrl: 'employee.component.html'
})
export class EmployeeComponent implements OnInit {
  employees$ = this.employeeQuery.selectAll().pipe(tap(item => {
      this.employees = item
    }
  ))
  total$ = this.employeeQuery.select(state => state.total)
  loading$ = this.employeeQuery.select(state => state.loading)
  added$ = this.employeeQuery.select(state => state.added)
  positions$ = this.positionQuery.selectAll()
  branches$ = this.branchQuery.selectAll()
  provinces$ = this.provinceService.getAll()
  districts: District[] = []
  wards: Ward[] = []
  employees: EmployeeEntity[] = []
  roleEnum = Role;
  employeeTypeConstant = EmployeeTypeConstant
  genderTypeConstant = GenderTypeConstant
  flatSalaryTypeConstant = FlatSalaryTypeConstant
  sortEnum = sortEmployeeTypeEnum;
  pageSize = 15;
  pageIndexInit = 0;
  searchType = SearchEmployeeType;
  genderType = Gender;
  flatSalary = FlatSalaryTypeEnum;
  ItemContextMenu = ItemContextMenu;
  empStatusContain = EmployeeStatusConstant;
  employeeType = EmployeeType;
  categories$ = new Observable<Category[]>();
  categoryControl = new FormControl('');
  role = window.localStorage.getItem('role')
  formGroup = new FormGroup({
    name: new FormControl(''),
    phone: new FormControl(''),
    identify: new FormControl(''),
    address: new FormControl(''),
    province: new FormControl(''),
    district: new FormControl(''),
    ward: new FormControl(''),
    gender: new FormControl(''),
    flatSalary: new FormControl(FlatSalaryTypeEnum.ALL),
    position: new FormControl(''),
    branch: new FormControl(''),
    employeeType: new FormControl(EmployeeType.EMPLOYEE_FULL_TIME),
    status: new FormControl(EmployeeStatusEnum.IS_ACTIVE)
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
    private readonly provinceService: ProvinceService
  ) {
  }

  ngOnInit(): void {
    this.actions$.dispatch(
      EmployeeActions.loadAll(this.mapEmployeeDto(this.formGroup.value, false))
    );

    this.actions$.dispatch(BranchActions.loadAll({}));

    this.formGroup.valueChanges
      .pipe(debounceTime(1500))
      .subscribe(val => {
        this.actions$.dispatch(EmployeeActions.loadAll(this.mapEmployeeDto(this.formGroup.value, false)));
      });

    this.categoryControl.valueChanges.subscribe(val => {
      if (val !== 0) {
        this.actions$.dispatch(EmployeeActions.loadAll(this.mapEmployeeDto(this.formGroup.value, false)));
      }
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

  onAdd(employeeInit?: Employee): void {
  }

  onDelete(employeeId: any): void {
  }

  mapEmployeeDto(val: any, isPagination: boolean): SearchEmployeeDto {
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
        isFlatSalary: val.flatSalary,
        categoryId: this.categoryControl.value !== 0 ? this.categoryControl.value : ''
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
  }

  onRestore($event: any) {
  }

  onAddCategory() {
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

  onUpdateCategory(): any {

  }
}
