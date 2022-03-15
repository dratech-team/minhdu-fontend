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
import {MatDialog} from '@angular/material/dialog';
import {MatMenuTrigger} from '@angular/material/menu';
import {ActivatedRoute, Router} from '@angular/router';
import {
  EmployeeAction,
  selectEmployeeAdding,
  selectEmployeeLoaded,
  selectorAllEmployee,
  selectorScrollXTotal,
  selectorTotalEmployee
} from '@minhdu-fontend/employee';
import {
  ConvertBoolean,
  EmployeeType,
  FlatSalary,
  Gender,
  ItemContextMenu,
  SearchEmployeeType,
  sortEmployeeTypeEnum
} from '@minhdu-fontend/enums';
import {getAllOrgchart, OrgchartActions} from '@minhdu-fontend/orgchart';
import {select, Store} from '@ngrx/store';
import {catchError, debounceTime, map, startWith, tap} from 'rxjs/operators';
import {getAllPosition, PositionActions} from '@minhdu-fontend/orgchart-position';
import {DeleteEmployeeComponent} from '../../components/dialog-delete-employee/delete-employee.component';
import {Api, EmployeeConstant} from '@minhdu-fontend/constants';
import {ProvinceAction, selectAllProvince} from '@minhdu-fontend/location';
import {Observable, of, Subject, throwError} from 'rxjs';
import {Category, District, Employee, Position, Province, Ward} from '@minhdu-fontend/data-models';
import {checkInputNumber, searchAutocomplete} from '@minhdu-fontend/utils';
import {DialogExportComponent} from '@minhdu-fontend/components';
import {DialogCategoryComponent} from '../../components/category/dialog-category.component';
import {CategoryService} from '../../../../../../../../libs/employee/src/lib/+state/service/category.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {EmployeeService} from '../../../../../../../../libs/employee/src/lib/+state/service/employee.service';
import {MatSort, Sort} from '@angular/material/sort';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {AddEmployeeComponent} from '../../components/employee/add-employee.component';
import {Role} from '../../../../../../../../libs/enums/hr/role.enum';

@Component({
  templateUrl: 'employee.component.html'
})
export class EmployeeComponent implements OnInit, AfterViewChecked {
  @ViewChild('tableEmployee') tableEmployee!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
  @ViewChild(MatSort) sort!: MatSort;

  districts$!: Observable<District[]>;
  wards$!: Observable<Ward[]>;

  scrollX$ = this.store.select(selectorScrollXTotal);
  total$ = this.store.select(selectorTotalEmployee);
  loaded$ = this.store.pipe(select(selectEmployeeLoaded));
  adding$ = this.store.pipe(select(selectEmployeeAdding));
  lstPosition: Position[] = [];
  branches$ = this.store.pipe(select(getAllOrgchart)).pipe(map(branches => {
    if (branches.length === 1) {
      this.categories$ = this.categoryService.getAll({branchId: branches[0].name});
      this.formGroup.get('branch')?.setValue(branches[0].name, {emitEvent: false});
      this.lstPosition = branches[0].positions ? branches[0].positions : []
    }
    return branches;
  }));
  provinces$ = this.store.pipe(select(selectAllProvince));

  roleEnum = Role;
  sortEnum = sortEmployeeTypeEnum;
  pageSize = 35;
  pageIndexInit = 0;
  searchType = SearchEmployeeType;
  genderType = Gender;
  flatSalary = FlatSalary;
  convertBoolean = ConvertBoolean;
  ItemContextMenu = ItemContextMenu;
  employeeContain = EmployeeConstant;
  employeeType = EmployeeType;
  isLeft = false;
  eventScrollX = new Subject<any>();
  categories$ = new Observable<Category[]>();
  employees: Employee[] = [];
  employeeControl = new FormControl(EmployeeType.EMPLOYEE_FULL_TIME);
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
    employeeType: new FormControl(EmployeeType.EMPLOYEE_FULL_TIME)
  });

  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store,
    private readonly router: Router,
    private readonly activeRouter: ActivatedRoute,
    private readonly categoryService: CategoryService,
    private readonly ref: ChangeDetectorRef,
    private readonly employeeService: EmployeeService,
    private readonly message: NzMessageService,
    private readonly modal: NzModalService,
    private readonly viewContentRef: ViewContainerRef,
  ) {
    this.store.pipe(select(selectorAllEmployee))
      .pipe(tap(employees => this.employees = employees))
      .subscribe();
  }

  ngAfterViewChecked() {
    this.ref.detectChanges();
  }

  ngOnInit(): void {
    this.role = window.localStorage.getItem('role');
    this.store.dispatch(ProvinceAction.loadAllProvinces());
    this.activeRouter.queryParams.subscribe(val => {
      if(val.branch){
        this.formGroup.get('branch')?.setValue(JSON.parse(val.branch), {emitEvent: false});
        this.lstPosition = JSON.parse(val.branch).positions
        this.categories$ = this.categoryService.getAll({branchId: JSON.parse(val.branch).id})
      }
      if (val.position) {
        this.formGroup.get('position')?.setValue(JSON.parse(val.position), {emitEvent: false});
      }
    });
    this.store.dispatch(
      EmployeeAction.loadInit({
        employee: {
          take: this.pageSize,
          skip: this.pageIndexInit,
          isLeft: this.isLeft,
          branch: this.formGroup.value.branch ? this.formGroup.value.branch.name : '',
          position: this.formGroup.value.position ? this.formGroup.value.position.name : '',
          employeeType: EmployeeType.EMPLOYEE_FULL_TIME
        }
      })
    );
    this.store.dispatch(OrgchartActions.init());
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1500)
      ).subscribe(val => {
      this.store.dispatch(EmployeeAction.loadInit({employee: this.employee(val)}));
    });

    this.employeeControl.valueChanges.subscribe(val => {
      switch (val) {
        case EmployeeType.EMPLOYEE_LEFT_AT:
          this.isLeft = true;
          this.store.dispatch(EmployeeAction.loadInit({
            employee: {take: this.pageSize, skip: this.pageIndexInit, isLeft: this.isLeft}
          }));
          break;
        case EmployeeType.EMPLOYEE_SEASONAL:
          this.isLeft = false;
          this.store.dispatch(EmployeeAction.loadInit({
            employee: {take: this.pageSize, skip: this.pageIndexInit}
          }));
          break;
        default:
          this.isLeft = false;
          this.store.dispatch(EmployeeAction.loadInit({
            employee: {take: this.pageSize, skip: this.pageIndexInit}
          }));
      }
    });

    this.provinces$ = searchAutocomplete(
      this.formGroup.get('province')?.valueChanges.pipe(startWith('')) || of(''),
      this.provinces$
    );

    this.eventScrollX.pipe(
      debounceTime(200)
    ).subscribe(event => {
      this.store.dispatch(EmployeeAction.updateStateEmployee({
        scrollX: this.tableEmployee.nativeElement.scrollLeft
      }));
    });

    this.categoryControl.valueChanges.subscribe(val => {
      if (val !== 0) {
        this.store.dispatch(EmployeeAction.loadInit({
          employee: this.employee(this.formGroup.value)
        }));
      }
    });

    this.formGroup.get('branch')?.valueChanges.pipe(debounceTime(1500)).subscribe(branch => {
      this.categories$ = this.categoryService.getAll({branch: branch.name});
      this.lstPosition = branch.positions
    });
  }

  add(): void {
    this.modal.create({
      nzTitle: 'Thêm nhân viên',
      nzContent: AddEmployeeComponent,
      nzViewContainerRef: this.viewContentRef,
      nzFooter: null,
      nzWidth: '65vw',
      nzMaskClosable: false
    });
  }

  delete(employeeId: any): void {
    this.dialog.open(DeleteEmployeeComponent, {
      width: 'fit-content',
      data: {employee: employeeId, permanentlyDeleted: this.isLeft}
    }).afterClosed().subscribe(() => {
      this.store.dispatch(
        EmployeeAction.loadInit({
          employee: {
            take: this.pageSize,
            skip: this.pageIndexInit,
            isLeft: this.isLeft,
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
      province: val.province,
      district: val.district,
      ward: val.ward,
      gender: val.gender,
      position: val.position ? val.position.name : '',
      branch: val.branch ? val.branch.name : '',
      // workedAt: val.workedAt,
      isLeft: this.isLeft,
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

  onSelectProvince(province: Province) {
    this.districts$ = new Observable(sub => {
      sub.next(province.districts);
    });
    this.districts$ = searchAutocomplete(
      this.formGroup.get('district')?.valueChanges.pipe(startWith('')) || of(''),
      this.districts$
    );
    this.formGroup.get('province')?.patchValue(province.name);
  }

  onSelectDistrict(district: District) {
    this.wards$ = new Observable(sub => {
      sub.next(district.wards);
    });
    this.wards$ = searchAutocomplete(
      this.formGroup.get('ward')?.valueChanges.pipe(startWith('')) || of(''),
      this.wards$
    );
    this.formGroup.get('district')?.patchValue(district.name);
  }

  onSelectWard(wardName: string) {
    this.formGroup.get('ward')?.patchValue(wardName);
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
      birthday: val.birthday,
      phone: val.phone,
      identity: val.identity,
      address: val.address,
      province: val.province,
      district: val.district,
      ward: val.ward,
      gender: val.gender,
      position: val.position ? val.position.name : '',
      branch: val.branch ? val.branch.name : '',
      workedAt: val.workedAt,
      isLeft: this.isLeft,
      employeeType: val.employeeType,
      isFlatSalary:
        val.flatSalary === this.flatSalary.FLAT_SALARY
          ? this.convertBoolean.TRUE
          : val.flatSalary === this.flatSalary.NOT_FLAT_SALARY
            ? this.convertBoolean.FALSE
            : val.flatSalary,
      orderBy: this.sort ? this.sort.active : '',
      orderType: this.sort ? this.sort.direction === 'asc' ? 'UP' : 'DOWN' : ''
    };
    this.dialog.open(DialogExportComponent, {
      width: 'fit-content',
      data: {
        title: 'Xuất bảng nhân viên',
        exportType: 'EMPLOYEE',
        params: employee,
        api: Api.HR.EMPLOYEE.EMPLOYEE_EXPORT
      }
    });
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
