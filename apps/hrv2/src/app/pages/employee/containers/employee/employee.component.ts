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
  Gender,
  ItemContextMenu,
  SearchEmployeeType,
  sortEmployeeTypeEnum
} from '@minhdu-fontend/enums';
import {catchError, debounceTime, tap} from 'rxjs/operators';
import {EmployeeStatusConstant, GenderTypeConstant, PaginationDto} from '@minhdu-fontend/constants';
import {Observable, Subject, throwError} from 'rxjs';
import {Category, District, Employee, Ward} from '@minhdu-fontend/data-models';
import {checkInputNumber} from '@minhdu-fontend/utils';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatSort, Sort} from '@angular/material/sort';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {Role} from '@minhdu-fontend/enums';
import {ExportService} from "@minhdu-fontend/service";
import {Actions} from "@datorama/akita-ng-effects";
import {EmployeeActions, EmployeeQuery, EmployeeService, EmployeeStore} from "@minhdu-fontend/employee-v2";
import {EmployeeTypeConstant} from "../constants/employee-type.constant";
import {FlatSalaryTypeConstant} from "../constants/flat-salary-type.constant";
import {ProvinceService} from "@minhdu-fontend/location";
import {FlatSalaryTypeEnum} from "../../enums/flat-salary-type.enum";
import {EmployeeEntity} from "@minhdu-fontend/employee-v2";
import {BranchActions, BranchQuery, PositionActions, PositionQuery} from "@minhdu-fontend/orgchart-v2";

@Component({
  templateUrl: 'employee.component.html'
})
export class EmployeeComponent implements OnInit, AfterViewChecked {
  @ViewChild('tableEmployee') tableEmployee!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
  @ViewChild(MatSort) sort!: MatSort;
  employees$ = this.employeeQuery.selectAll().pipe(tap(item => {
      this.employees = item
    }
  ))
  scrollX$ = this.employeeQuery.select(state => state.scrollX);
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
  pageSize = 10;
  pageIndexInit = 0;
  searchType = SearchEmployeeType;
  genderType = Gender;
  flatSalary = FlatSalaryTypeEnum;
  convertBoolean = ConvertBoolean;
  ItemContextMenu = ItemContextMenu;
  empStatusContain = EmployeeStatusConstant;
  employeeType = EmployeeType;
  eventScrollX = new Subject<any>();
  categories$ = new Observable<Category[]>();
  categoryControl = new FormControl('');
  role = window.localStorage.getItem('role')
  formGroup = new FormGroup({
    name: new FormControl(''),
    phone: new FormControl(''),
    identity: new FormControl(''),
    address: new FormControl(''),
    province: new FormControl(''),
    district: new FormControl(''),
    ward: new FormControl(''),
    gender: new FormControl(''),
    flatSalary: new FormControl('-1'),
    position: new FormControl(''),
    branch: new FormControl(''),
    employeeType: new FormControl(EmployeeType.EMPLOYEE_FULL_TIME),
    status: new FormControl(1)
  });

  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    private readonly actions$: Actions,
    private readonly employeeQuery: EmployeeQuery,
    private readonly employeeStore: EmployeeStore,
    private readonly router: Router,
    private readonly activeRouter: ActivatedRoute,
    private readonly ref: ChangeDetectorRef,
    private readonly employeeService: EmployeeService,
    private readonly message: NzMessageService,
    private readonly modal: NzModalService,
    private readonly exportService: ExportService,
    private readonly positionQuery: PositionQuery,
    private readonly branchQuery: BranchQuery,
    private readonly provinceService: ProvinceService
  ) {
  }

  ngAfterViewChecked() {
    this.ref.detectChanges();
  }

  ngOnInit(): void {
    this.activeRouter.queryParams.subscribe(val => {
      if (val.branch) {
        this.formGroup.get('branch')?.setValue(JSON.parse(val.branch), {emitEvent: false});
      }
      if (val.position) {
        this.formGroup.get('position')?.setValue(JSON.parse(val.position), {emitEvent: false});
      }
    });


    this.actions$.dispatch(
      EmployeeActions.loadAll({
        search: this.mapEmployee(this.formGroup.value)
      })
    );

    this.actions$.dispatch(BranchActions.loadAll({}));


    this.formGroup.valueChanges
      .pipe(debounceTime(1500))
      .subscribe(val => {
        this.actions$.dispatch(EmployeeActions.loadAll({search: this.mapEmployee(this.formGroup.value)}));
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
        this.actions$.dispatch(EmployeeActions.loadAll({
          search: this.mapEmployee(this.formGroup.value)
        }));
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

  add(employeeInit?: Employee): void {
  }

  delete(employeeId: any): void {
  }

  onScrollX(event: any) {
    this.eventScrollX.next(event);
  }

  mapEmployee(val: any, isPagination?: boolean) {
    return {
      take: PaginationDto.take,
      skip: isPagination ? this.employeeQuery.getCount() : PaginationDto.skip,
      name: val.name,
      phone: val.phone,
      identity: val.identity,
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
    };
  }

  onScroll() {
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
  }

  onRestore($event: any) {
  }

  addCategory() {
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
    // this.dialog.open(DialogCategoryComponent, {
    //   width: 'fit-content',
    //   data: {categoryId: this.categoryControl.value, isUpdate: true}
    // })
    //   .afterClosed().subscribe(() => {
    //   this.categories$ = this.categoryService.getAll();
    //   this.actions$.dispatch(EmployeeActions.loadAll({search: this.employee(this.formGroup.value)}));
    // });
  }

  sortEmployee(sort: Sort) {
    this.actions$.dispatch(EmployeeActions.loadAll({
      search: this.mapEmployee(this.formGroup.value)
    }));
  }
}
