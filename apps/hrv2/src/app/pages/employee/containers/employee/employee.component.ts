import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatMenuTrigger} from '@angular/material/menu';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ConvertBoolean,
  EmployeeType,
  FlatSalary,
  Gender,
  ItemContextMenu,
  SearchEmployeeType,
  sortEmployeeTypeEnum
} from '@minhdu-fontend/enums';
import {OrgchartActions} from '@minhdu-fontend/orgchart';
import {catchError, debounceTime} from 'rxjs/operators';
import {Api, EmployeeStatusConstant} from '@minhdu-fontend/constants';
import {Observable, Subject, throwError} from 'rxjs';
import {Category, Employee} from '@minhdu-fontend/data-models';
import {checkInputNumber} from '@minhdu-fontend/utils';
import {DialogExportComponent} from '@minhdu-fontend/components';
import {CategoryService} from '../../../../../../../../libs/employee/src/lib/+state/service/category.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {EmployeeService} from '../../../../../../../../libs/employee/src/lib/+state/service/employee.service';
import {MatSort, Sort} from '@angular/material/sort';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {Role} from '../../../../../../../../libs/enums/hr/role.enum';
import {ProvinceService} from "../../../../../../../../libs/location/src/lib/service/province.service";
import {ExportService} from "@minhdu-fontend/service";
import {Actions} from "@datorama/akita-ng-effects";
import {EmployeeQuery} from "../../../../../../../../libs/employee-v2/src/lib/employee/state";
import {EmployeeActions} from "../../../../../../../../libs/employee-v2/src/lib/employee/state/employee.actions";
import {EmployeeStore} from "../../../../../../../../libs/employee-v2/src/lib/employee/state";

@Component({
  templateUrl: 'employee.component.html'
})
export class EmployeeComponent implements OnInit, AfterViewChecked {
  @ViewChild('tableEmployee') tableEmployee!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
  @ViewChild(MatSort) sort!: MatSort;
  employees$ = this.employeeQuery.selectAll()
  scrollX$ = this.employeeQuery.select(state => state.scrollX);
  total$ = this.employeeQuery.select(state => state.total)
  loading$ = this.employeeQuery.select(state => state.loading)
  added$ = this.employeeQuery.select(state => state.added)
  provinces$ = this.provinceService.getAll()
  roleEnum = Role;
  sortEnum = sortEmployeeTypeEnum;
  pageSize = 35;
  pageIndexInit = 0;
  searchType = SearchEmployeeType;
  genderType = Gender;
  flatSalary = FlatSalary;
  convertBoolean = ConvertBoolean;
  ItemContextMenu = ItemContextMenu;
  empStatusContain = EmployeeStatusConstant;
  employeeType = EmployeeType;
  eventScrollX = new Subject<any>();
  categories$ = new Observable<Category[]>();
  categoryControl = new FormControl('');
  role!: string | null;
  formGroup = new FormGroup({
    name: new FormControl(''),
    // birthday: new FormControl(''),
    phone: new FormControl(''),
    identity: new FormControl(''),
    address: new FormControl(''),
    province: new FormControl(''),
    district: new FormControl(''),
    ward: new FormControl(''),
    gender: new FormControl(''),
    // workedAt: new FormControl(''),
    flatSalary: new FormControl('-1'),
    position: new FormControl(''),
    branch: new FormControl(''),
    employeeType: new FormControl(EmployeeType.EMPLOYEE_FULL_TIME),
    status: new FormControl(0)
  });

  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    private readonly actions$: Actions,
    private readonly employeeQuery: EmployeeQuery,
    private readonly employeeStore: EmployeeStore,
    private readonly router: Router,
    private readonly activeRouter: ActivatedRoute,
    private readonly categoryService: CategoryService,
    private readonly ref: ChangeDetectorRef,
    private readonly employeeService: EmployeeService,
    private readonly message: NzMessageService,
    private readonly modal: NzModalService,
    private readonly viewContentRef: ViewContainerRef,
    private readonly provinceService: ProvinceService,
    private readonly exportService: ExportService,
  ) {
  }

  ngAfterViewChecked() {
    this.ref.detectChanges();
  }

  ngOnInit(): void {
    this.role = window.localStorage.getItem('role');
    this.activeRouter.queryParams.subscribe(val => {
      if (val.branch) {
        this.formGroup.get('branch')?.setValue(JSON.parse(val.branch), {emitEvent: false});
        this.categories$ = this.categoryService.getAll({branchId: JSON.parse(val.branch).id})
      }
      if (val.position) {
        this.formGroup.get('position')?.setValue(JSON.parse(val.position), {emitEvent: false});
      }
    });
    this.actions$.dispatch(
      EmployeeActions.loadAll({
        search: {
          take: this.pageSize,
          skip: this.pageIndexInit,
          status: this.formGroup.value.status,
          branch: this.formGroup.value.branch ? this.formGroup.value.branch.name : '',
          position: this.formGroup.value.position ? this.formGroup.value.position.name : '',
          employeeType: EmployeeType.EMPLOYEE_FULL_TIME
        }
      })
    );
    this.actions$.dispatch(OrgchartActions.init());
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1500)
      ).subscribe(val => {
      this.actions$.dispatch(EmployeeActions.loadAll({search:this.employee(this.formGroup.value)}));
    });

    this.eventScrollX.pipe(
      debounceTime(200)
    ).subscribe(event => {
      this.employeeStore.update(state => ({
        ...state, scrollX: this.tableEmployee.nativeElement.scrollLeft
      }));
    });

    this.categoryControl.valueChanges.subscribe(val => {
      if (val !== 0) {
        this.store.dispatch(EmployeeAction.loadInit({
          employee: this.employee(this.formGroup.value)
        }));
      }
    });

    this.formGroup.get('branch')?.valueChanges.subscribe(branch => {
      if (branch) {
        this.store.dispatch(OrgchartActions.getBranch({id: branch.id}))
      }
      this.categories$ = this.categoryService.getAll({branch: branch.name});
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

  add(employeeInit?: Employee): void {
    this.modal.create({
      nzTitle: 'Thêm nhân viên',
      nzContent: AddEmployeeComponent,
      nzViewContainerRef: this.viewContentRef,
      nzComponentParams: {
        employeeInit
      },
      nzFooter: null,
      nzWidth: '65vw',
      nzMaskClosable: false
    });
  }

  delete(employeeId: any): void {
    this.dialog.open(DeleteEmployeeComponent, {
      width: 'fit-content',
      data: {employee: employeeId, permanentlyDeleted: this.formGroup.value === 1}
    }).afterClosed().subscribe(() => {
      this.store.dispatch(
        EmployeeAction.loadInit({
          employee: {
            take: this.pageSize,
            skip: this.pageIndexInit,
            status: this.formGroup.value.status,
            branch: this.formGroup.value.branch ? this.formGroup.value.branch.name : '',
            position: this.formGroup.value.position ? this.formGroup.value.position.name : '',
            employeeType: EmployeeType.EMPLOYEE_FULL_TIME
          }
        })
      );
    });
  }

  onScrollX(event: any) {
    this.eventScrollX.next(event);
  }

  employee(val: any) {
    const employee = {
      skip: this.pageIndexInit,
      take: this.pageSize,
      name: val.name,
      // birthday: val.birthday,
      phone: val.phone,
      identity: val.identity,
      address: val.address,
      province: val.province?.name || '',
      district: val.district?.name || '',
      ward: val.ward?.name || '',
      gender: val.gender,
      position: val.position ? val.position.name : '',
      branch: val.branch ? val.branch.name : '',
      // workedAt: val.workedAt,
      status: val.status,
      employeeType: val.employeeType,
      isFlatSalary: val.flatSalary,
      categoryId: this.categoryControl.value !== 0 ? this.categoryControl.value : ''

    };
    if (this.sort.active) {
      Object.assign(employee, {
        orderBy: this.sort.active ? this.sort.active : '',
        orderType: this.sort ? this.sort.direction : ''
      });
    }
    if (val.workedAt) {
      return employee;
    } else {
      // delete employee.workedAt;
      return employee;
    }
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(EmployeeAction.loadMoreEmployees({employee: this.employee(val)}));
  }

  readAndUpdate($event: any, isUpdate?: boolean): void {
    this.router.navigate(['ho-so/chi-tiet-nhan-vien', $event.id], {
      queryParams: {
        isUpdate
      }
    }).then();
  }

  // permanentlyDeleted($event: any) {
  //   this.dialog.open(DeleteEmployeeComponent, {
  //     width: 'fit-content',
  //     data: { employee: $event, permanentlyDeleted: true }
  //   });
  // }

  checkInputNumber(event: any) {
    return checkInputNumber(event);
  }

  printEmployee() {
    const val = this.formGroup.value;
    const employee = {
      categoryId: this.categoryControl.value !== 0 ? this.categoryControl.value : '',
      name: val.name,
      // birthday: val.birthday,
      phone: val.phone,
      identity: val.identity,
      address: val.address,
      province: val.province,
      district: val.district,
      ward: val.ward,
      gender: val.gender,
      position: val.position ? val.position.name : '',
      branch: val.branch ? val.branch.name : '',
      // workedAt: val.workedAt,
      status: val.status,
      employeeType: val.employeeType,
      isFlatSalary: val.flatSalary,
      exportType: 'EMPLOYEES'
    };
    if (this.sort.active) {
      Object.assign(employee, {
        orderBy: this.sort.active ? this.sort.active : '',
        orderType: this.sort ? this.sort.direction : ''
      });
    }
    this.dialog.open(DialogExportComponent, {
      width: 'fit-content',
      data: {
        filename: 'Danh sách nhân viên',
        title: 'Xuất bảng nhân viên',
        params: employee,
        api: Api.HR.EMPLOYEE.EMPLOYEE_EXPORT
      }
    })
  }

  onRestore($event: any) {
    this.dialog.open(DeleteEmployeeComponent, {
      width: '300px',
      data: {employee: $event, leftAt: true}
    });
  }

  addCategory() {
    this.dialog.open(DialogCategoryComponent, {width: 'fit-content'}).afterClosed().subscribe(() => {
      this.categories$ = this.categoryService.getAll();
    });
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

  updateCategory(): any {
    if (this.categoryControl.value === 0 || !this.categoryControl.value) {
      return this.message.error('Chưa chọn danh mục để sửa');
    }
    this.dialog.open(DialogCategoryComponent, {
      width: 'fit-content',
      data: {categoryId: this.categoryControl.value, isUpdate: true}
    })
      .afterClosed().subscribe(() => {
      this.categories$ = this.categoryService.getAll();
      this.store.dispatch(EmployeeAction.loadInit({employee: this.employee(this.formGroup.value)}));
    });
  }

  sortEmployee(sort: Sort) {
    this.store.dispatch(EmployeeAction.loadInit({
      employee: this.employee(this.formGroup.value)
    }));
  }
}
