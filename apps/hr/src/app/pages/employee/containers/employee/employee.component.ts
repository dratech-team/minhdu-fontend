import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
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
  SearchEmployeeType
} from '@minhdu-fontend/enums';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { select, Store } from '@ngrx/store';
import { debounceTime, startWith } from 'rxjs/operators';
import { getAllPosition, PositionActions } from '@minhdu-fontend/orgchart-position';
import { DeleteEmployeeComponent } from '../../components/dialog-delete-employee/delete-employee.component';
import { AddEmployeeComponent } from '../../components/employee/add-employee.component';
import { Api, EmployeeConstant } from '@minhdu-fontend/constants';
import { selectAllProvince } from '@minhdu-fontend/location';
import { ProvinceAction } from '../../../../../../../../libs/location/src/lib/+state/province/nation.action';
import { Observable, of, Subject } from 'rxjs';
import { District, Province, Ward } from '@minhdu-fontend/data-models';
import { checkInputNumber, searchAutocomplete } from '@minhdu-fontend/utils';
import { DialogExportComponent } from '@minhdu-fontend/components';

@Component({
  templateUrl: 'employee.component.html'
})
export class EmployeeComponent implements OnInit {
  @ViewChild('tableEmployee') tableEmployee!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;

  districts$!: Observable<District[]>;
  wards$!: Observable<Ward[]>;

  pageSize: number = 35;
  pageIndexInit = 0;
  searchType = SearchEmployeeType;
  genderType = Gender;
  flatSalary = FlatSalary;
  convertBoolean = ConvertBoolean;
  ItemContextMenu = ItemContextMenu;
  employeeContain = EmployeeConstant;
  employeeType = EmployeeType;
  isLeft = false;
  branchName = '';
  positionName = '';
  eventScrollX = new Subject<any>();

  scrollX$ = this.store.select(selectorScrollXTotal);
  total$ = this.store.select(selectorTotalEmployee);
  employees$ = this.store.pipe(select(selectorAllEmployee));
  loaded$ = this.store.pipe(select(selectEmployeeLoaded));
  adding$ = this.store.pipe(select(selectEmployeeAdding));
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));
  provinces$ = this.store.pipe(select(selectAllProvince));

  employeeControl = new FormControl(EmployeeType.EMPLOYEE_FULL_TIME);
  formGroup = new FormGroup({
    name: new FormControl(''),
    birthday: new FormControl(''),
    phone: new FormControl(''),
    identity: new FormControl(''),
    address: new FormControl(''),
    province: new FormControl(''),
    district: new FormControl(''),
    ward: new FormControl(''),
    gender: new FormControl(''),
    workedAt: new FormControl(''),
    flatSalary: new FormControl(''),
    position: new FormControl(this.positionName),
    branch: new FormControl(this.branchName),
    employeeType: new FormControl('')
  });

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store,
    private readonly router: Router,
    private readonly activeRouter: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(ProvinceAction.loadAllProvinces());
    this.activeRouter.queryParams.subscribe(val => {
      if (val.branch) {
        this.formGroup.get('branch')?.setValue(val.branch, { emitEvent: false });
        this.branchName = val.branch;
      }
      if (val.position) {
        this.formGroup.get('position')?.setValue(val.position, { emitEvent: false });
        this.positionName = val.position;
      }
    });
    this.store.dispatch(
      EmployeeAction.loadInit({
        employee: {
          take: this.pageSize,
          skip: this.pageIndexInit,
          isLeft: this.isLeft,
          branch: this.branchName,
          position: this.positionName
        }
      })
    );
    this.store.dispatch(PositionActions.loadPosition());
    this.store.dispatch(OrgchartActions.init());
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1500)
      ).subscribe(val => {
      this.store.dispatch(EmployeeAction.loadInit({ employee: this.employee(val) }));
    });

    this.employeeControl.valueChanges.subscribe(val => {
      switch (val) {
        case EmployeeType.EMPLOYEE_LEFT_AT:
          this.isLeft = true;
          this.store.dispatch(EmployeeAction.loadInit({
            employee: { take: this.pageSize, skip: this.pageIndexInit, isLeft: this.isLeft }
          }));
          break;
        case EmployeeType.EMPLOYEE_SEASONAL:
          this.isLeft = false;
          this.store.dispatch(EmployeeAction.loadInit({
            employee: { take: this.pageSize, skip: this.pageIndexInit }
          }));
          break;
        default:
          this.isLeft = false;
          this.store.dispatch(EmployeeAction.loadInit({
            employee: { take: this.pageSize, skip: this.pageIndexInit }
          }));
      }
    });

    this.positions$ = searchAutocomplete(
      this.formGroup.get('position')?.valueChanges.pipe(startWith('')) || of(''),
      this.positions$
    );

    this.branches$ = searchAutocomplete(
      this.formGroup.get('branch')?.valueChanges.pipe(startWith('')) || of(''),
      this.branches$
    );

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

  }

  add(): void {
    this.dialog.open(AddEmployeeComponent, {
      width: '60%'
    });
  }

  delete($event: any): void {
    this.dialog.open(DeleteEmployeeComponent, {
      width: 'fit-content',
      data: { employeeId: $event.id, leftAt: $event.leftAt }
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
      birthday: val.birthday,
      phone: val.phone,
      identity: val.identity,
      address: val.address,
      province: val.province,
      district: val.district,
      ward: val.ward,
      gender: val.gender,
      position: val.position,
      branch: val.branch,
      workedAt: val.workedAt,
      isLeft: this.isLeft,
      employeeType: val.employeeType,
      isFlatSalary:
        val.flatSalary === this.flatSalary.FLAT_SALARY
          ? this.convertBoolean.TRUE
          : val.flatSalary === this.flatSalary.NOT_FLAT_SALARY
            ? this.convertBoolean.FALSE
            : val.flatSalary
    };
    if (val.workedAt) {
      return employee;
    } else {
      // delete employee.workedAt;
      return employee;
    }
  }

  onSelectPosition(positionName: string) {
    this.formGroup.get('position')?.patchValue(positionName);
  }

  onSelectBranch(branchName: string) {
    this.formGroup.get('branch')?.patchValue(branchName);
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
    this.store.dispatch(EmployeeAction.loadMoreEmployees({ employee: this.employee(val) }));
  }

  readAndUpdate($event: any): void {
    this.router.navigate(['ho-so/chi-tiet-nhan-vien', $event.id]).then();
  }

  permanentlyDeleted($event: any) {
    this.dialog.open(DeleteEmployeeComponent, {
      width: 'fit-content',
      data: { employee: $event, permanentlyDeleted: true }
    });
  }

  checkInputNumber(event: any) {
    return checkInputNumber(event);
  }

  printEmployee() {
    const val = this.formGroup.value;
    const employee = {
      name: val.name,
      birthday: val.birthday,
      phone: val.phone,
      identity: val.identity,
      address: val.address,
      province: val.province,
      district: val.district,
      ward: val.ward,
      gender: val.gender,
      position: val.position,
      branch: val.branch,
      workedAt: val.workedAt,
      isLeft: this.isLeft,
      employeeType: val.employeeType,
      isFlatSalary:
        val.flatSalary === this.flatSalary.FLAT_SALARY
          ? this.convertBoolean.TRUE
          : val.flatSalary === this.flatSalary.NOT_FLAT_SALARY
            ? this.convertBoolean.FALSE
            : val.flatSalary
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
}
