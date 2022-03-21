import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Employee, ResponsePaginateOvertimePayroll} from '@minhdu-fontend/data-models';
import {
  EmployeeAction,
  selectEmployeeLoaded,
  selectorAllEmployee,
  selectorTotalEmployee
} from '@minhdu-fontend/employee';
import {SalaryTypeEnum} from '@minhdu-fontend/enums';
import {select, Store} from '@ngrx/store';
import {debounceTime, startWith, tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {getAllPosition, PositionActions} from "@minhdu-fontend/orgchart-position";
import {checkIsSelectAllInit, pickAll, pickOne, searchAutocomplete} from "@minhdu-fontend/utils";
import {Payroll} from "../../../+state/payroll/payroll.interface";
import {PayrollService} from "../../../service/payroll.service";


@Component({
  selector: 'app-pick-payroll-overtime',
  templateUrl: 'pick-payroll-overtime.component.html'
})
export class PickPayrollOvertimeComponent implements OnInit, OnChanges {
  @Input() checkAllowance = false;
  @Input() search: any;
  @Input() payrollsSelected: Payroll[] = [];
  @Input() allowPayrollsSelected: Payroll[] = [];
  @Output() EventSelectPayroll = new EventEmitter<Payroll[]>();
  @Output() EventSelectAllowance = new EventEmitter<Payroll[]>();
  formGroup = new FormGroup({
    name: new FormControl(''),
    position: new FormControl(''),
    code: new FormControl('')
  });
  pageSize = 30;
  pageIndex = 0;
  payrolls$ = new Observable<ResponsePaginateOvertimePayroll<Payroll>>()
  loaded$ = this.store.pipe(select(selectEmployeeLoaded));
  totalPayroll = 0
  type = SalaryTypeEnum;

  isSelectAllEmployee = false;
  isSelectAllowance = false;
  payrolls: Payroll[] = [];
  positions$ = this.store.pipe(select(getAllPosition));
  isEventSearch = false;
  differ: any;

  constructor(
    private readonly store: Store,
    private readonly snackBar: MatSnackBar,
    private readonly payrollService: PayrollService
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.payrollsSelected) {
      if (changes.payrollsSelected.currentValue.length === 0) {
        this.isSelectAllEmployee = false;
        this.isSelectAllowance = false;
      } else {
        this.isSelectAllEmployee =
          this.payrolls !== null &&
          this.payrolls.every((e) => this.payrollsSelected.some(item => item.id === e.id));
      }
    }
    if (changes.allowPayrollsSelected) {
      if (changes.allowPayrollsSelected.currentValue.length === 0) {
        this.isSelectAllowance = false;
      } else {
        this.isSelectAllowance =
          this.payrolls !== null &&
          this.payrolls.every((e) => this.allowPayrollsSelected.some(item => item.id === e.id));
      }
    }
    const currentTemplateId = changes.search?.currentValue?.templateId;
    const previousTemplateId = changes.search?.previousValue?.templateId;
    const currentCreatedPayroll = changes.search?.currentValue?.createdPayroll;
    const previousCreatedPayroll = changes.search?.previousValue?.createdPayroll;
    const currentEmployeeType = changes.search?.currentValue?.templateId;
    const previousEmployeeType = changes.search?.previousValue?.templateId;
    const currentRecipeType = changes.search?.currentValue?.templateId;
    if (currentCreatedPayroll &&
      (currentTemplateId !== previousTemplateId
        || currentCreatedPayroll !== previousCreatedPayroll
        || currentEmployeeType !== previousEmployeeType
        || currentRecipeType)
    ) {
      this.payrollsSelected = [];
      this.allowPayrollsSelected = [];
      this.isSelectAllowance = false;
      this.isSelectAllEmployee = false;
      this.EventSelectAllowance.emit(this.allowPayrollsSelected);
      this.EventSelectPayroll.emit(this.payrollsSelected);
      this.payrolls$ = this.payrollService.paginationPayroll(
        Object.assign(this.mapPayroll(this.formGroup.value), {take: this.pageSize, skip: this.pageIndex}))
    }
  }

  ngOnInit(): void {
    this.payrolls$.subscribe((respone) => {
      this.totalPayroll = respone.total
      if (respone.data.length === 0) {
        this.isSelectAllEmployee = false;
      }
      if (this.isEventSearch) {
        this.isSelectAllEmployee = checkIsSelectAllInit(respone.data, this.payrollsSelected);
        this.isSelectAllowance = checkIsSelectAllInit(respone.data, this.allowPayrollsSelected);
      }
      respone.data.forEach((payroll: Payroll) => {
        if (this.isSelectAllEmployee) {
          if (!this.payrollsSelected.some((e) => e.id === payroll.id)) {
            this.payrollsSelected.push(payroll);
          }
          if (this.isSelectAllowance) {
            if (!this.allowPayrollsSelected.some((e) => e.id === payroll.id)) {
              this.allowPayrollsSelected.push(payroll);
            }
          }
        }
      });
      this.payrolls = JSON.parse(JSON.stringify(respone.data));
    });

    this.store.dispatch(PositionActions.loadPosition());

    this.positions$ = searchAutocomplete(
      this.formGroup.get('position')?.valueChanges.pipe(startWith('')) || of(''),
      this.positions$
    );

    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.isEventSearch = true;
          this.payrolls$ = this.payrollService.paginationPayroll(
            Object.assign(this.mapPayroll(this.formGroup.value), {
              take: this.pageSize,
              skip: this.pageIndex
            })
          )
        })
      )
      .subscribe();
  }

  //check-box-payroll
  updateSelectEmployee(payroll: Payroll) {
    const val = pickOne(payroll, this.payrollsSelected, this.payrolls, this.allowPayrollsSelected);
    this.isSelectAllEmployee = val.isSelectAll;
    this.isSelectAllowance = val.isSelectAllowance;
    this.EventSelectPayroll.emit(this.payrollsSelected);
    this.EventSelectAllowance.emit(this.allowPayrollsSelected);
  }

  someCompleteEmployee(): boolean {
    return (
      this.payrolls.filter((e) => this.payrollsSelected.some(item => item.id === e.id)).length >
      0 && !this.isSelectAllEmployee
    );
  }

  setAllEmployee(select: boolean) {
    this.isSelectAllEmployee = select;
    if (this.payrolls.length === 0) {
      return;
    }
    this.isSelectAllowance = pickAll(
      select,
      this.payrolls,
      this.payrollsSelected,
      this.allowPayrollsSelected,
      this.isSelectAllowance);
    this.EventSelectPayroll.emit(this.payrollsSelected);
    this.EventSelectAllowance.emit(this.allowPayrollsSelected);
  }

  //check-box-allowance
  updateSelectAllowance(payroll: Payroll) {
    this.isSelectAllowance = pickOne(payroll, this.allowPayrollsSelected, this.payrolls).isSelectAll;
    this.EventSelectAllowance.emit(this.allowPayrollsSelected);
  }

  someCompleteAllowance(): boolean {
    return (
      this.payrolls.filter((e) => this.allowPayrollsSelected.some(item => item.id === e.id)).length >
      0 && !this.isSelectAllowance
    );
  }

  setAllAllowance(select: boolean) {
    this.isSelectAllowance = select;
    pickAll(select, this.payrolls, this.allowPayrollsSelected);
    this.EventSelectAllowance.emit(this.allowPayrollsSelected);
  }

  onSelectPosition(positionName: string) {
    this.formGroup.get('position')?.patchValue(positionName);
  }

  selectEmployee(payroll: Payroll) {
    return this.payrollsSelected.some((e) => e.id === payroll.id);
  }

  selectAllowanceEmployee(payroll: Payroll) {
    return this.allowPayrollsSelected.some((e) => e.id === payroll.id);
  }

  onScroll() {
    this.isEventSearch = false;
    const val = this.formGroup.value;
    this.payrolls$ = this.payrollService.paginationPayroll(
      this.mapPayroll(Object.assign(this.mapPayroll(this.formGroup.value), {
        take: this.pageSize,
        skip: this.payrolls.length
      }))
    )
  }

  mapPayroll(val: any) {
    return {
      name: val.name,
      position: val.position,
      code: val.code,
      createdPayroll: new Date(this.search.createdPayroll),
      templateId: this.search.templateId || '',
      employeeType: this.search.employeeType || '',
      recipeType: this.search.recipeType || ''
    };
  }
}
