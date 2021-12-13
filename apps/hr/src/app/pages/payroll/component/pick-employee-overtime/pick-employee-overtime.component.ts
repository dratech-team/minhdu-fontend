import {
  Component, DoCheck,
  EventEmitter,
  Input, IterableDiffers,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Employee } from '@minhdu-fontend/data-models';
import {
  EmployeeAction,
  selectEmployeeLoaded,
  selectorAllEmployee, selectorTotalEmployee
} from '@minhdu-fontend/employee';
import {SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { PickEmployeeService } from './pick-employee.service';
import { getAllPosition, PositionActions } from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { searchAutocomplete } from '../../../../../../../../libs/utils/orgchart.ultil';
import { checkIsSelectAllInit, pickAll, pickOne } from '../../../../../../../../libs/utils/pick-item.ultil';


@Component({
  selector: 'app-pick-employee-overtime',
  templateUrl: 'pick-employee-overtime.component.html'
})
export class PickEmployeeOvertimeComponent implements OnInit, OnChanges {
  @Input() checkAllowance = false;
  @Input() search: any;
  @Input() employeesSelected: Employee[] = [];
  @Input() allowEmployeesSelected: Employee[] = [];
  @Output() EventSelectEmployee = new EventEmitter<Employee[]>();
  @Output() EventSelectAllowance = new EventEmitter<Employee[]>();
  employees$ = this.store.pipe(select(selectorAllEmployee));
  loaded$ = this.store.pipe(select(selectEmployeeLoaded));
  total$ = this.store.pipe(select(selectorTotalEmployee));
  type = SalaryTypeEnum;
  pageSize = 30;
  pageIndex = 0;
  isSelectAllEmployee = false;
  isSelectAllowance = false;
  employees: Employee[] = [];
  formGroup = new FormGroup({
    name: new FormControl(''),
    position: new FormControl(''),
    code: new FormControl('')
  });
  positions$ = this.store.pipe(select(getAllPosition));
  isEventSearch = false;
  differ: any;

  constructor(
    private readonly store: Store,
    private readonly service: PickEmployeeService,
    private readonly snackBar: MatSnackBar
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.employeesSelected) {
      if (changes.employeesSelected.currentValue.length === 0) {
        this.isSelectAllEmployee = false;
        this.isSelectAllowance = false;
      } else {
        this.isSelectAllEmployee =
          this.employees !== null &&
          this.employees.every((e) => this.employeesSelected.some(item => item.id === e.id));
      }
    }
    if (changes.allowEmployeesSelected) {
      if (changes.allowEmployeesSelected.currentValue.length === 0) {
        this.isSelectAllowance = false;
      } else {
        this.isSelectAllowance =
          this.employees !== null &&
          this.employees.every((e) => this.allowEmployeesSelected.some(item => item.id === e.id));
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
      this.employeesSelected = [];
      this.allowEmployeesSelected = [];
      this.isSelectAllowance = false;
      this.isSelectAllEmployee = false;
      this.EventSelectAllowance.emit(this.allowEmployeesSelected);
      this.EventSelectEmployee.emit(this.employeesSelected);
      this.store.dispatch(
        EmployeeAction.loadInit({
          employee: this.employee(this.formGroup.value)
        })
      );
    }
  }

  ngOnInit(): void {
    this.employees$.subscribe((employees) => {
      if (employees.length === 0) {
        this.isSelectAllEmployee = false;
      }
      if (this.isEventSearch) {
        this.isSelectAllEmployee = checkIsSelectAllInit(employees, this.employeesSelected);
        this.isSelectAllowance = checkIsSelectAllInit(employees, this.allowEmployeesSelected);
      }
      employees.forEach((employee) => {
        if (this.isSelectAllEmployee) {
          if (!this.employeesSelected.some((e) => e.id === employee.id)) {
            this.employeesSelected.push(employee);
          }
          if (this.isSelectAllowance) {
            if (!this.allowEmployeesSelected.some((e) => e.id === employee.id)) {
              this.allowEmployeesSelected.push(employee);
            }
          }
        }
      });
      this.employees = JSON.parse(JSON.stringify(employees));
    });

    this.store.dispatch(PositionActions.loadPosition());

    this.positions$ = searchAutocomplete(
      this.formGroup.get('position')!.valueChanges.pipe(startWith('')),
      this.positions$
    );

    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.isEventSearch = true;
          this.store.dispatch(EmployeeAction.loadInit({ employee: this.employee(val) }));
        })
      )
      .subscribe();
  }

  //check-box-employee
  updateSelectEmployee(employee: Employee) {
    const val = pickOne(employee, this.employeesSelected, this.employees, this.allowEmployeesSelected);
    this.isSelectAllEmployee = val.isSelectAll;
    this.isSelectAllowance = val.isSelectAllowance;
    this.EventSelectEmployee.emit(this.employeesSelected);
    this.EventSelectAllowance.emit(this.allowEmployeesSelected);
  }

  someCompleteEmployee(): boolean {
    return (
      this.employees.filter((e) => this.employeesSelected.some(item => item.id === e.id)).length >
      0 && !this.isSelectAllEmployee
    );
  }

  setAllEmployee(select: boolean) {
    this.isSelectAllEmployee = select;
    if (this.employees.length === 0) {
      return;
    }
    this.isSelectAllowance = pickAll(
      select,
      this.employees,
      this.employeesSelected,
      this.allowEmployeesSelected,
      this.isSelectAllowance);
    this.EventSelectEmployee.emit(this.employeesSelected);
    this.EventSelectAllowance.emit(this.allowEmployeesSelected);
  }

  //check-box-allowance
  updateSelectAllowance(employee: Employee) {
    this.isSelectAllowance = pickOne(employee, this.allowEmployeesSelected, this.employees).isSelectAll;
    this.EventSelectAllowance.emit(this.allowEmployeesSelected);
  }

  someCompleteAllowance(): boolean {
    return (
      this.employees.filter((e) => this.allowEmployeesSelected.some(item => item.id === e.id)).length >
      0 && !this.isSelectAllowance
    );
  }

  setAllAllowance(select: boolean) {
    this.isSelectAllowance = select;
    pickAll(select, this.employees, this.allowEmployeesSelected);
    this.EventSelectAllowance.emit(this.allowEmployeesSelected);
  }

  onSelectPosition(positionName: string) {
    this.formGroup.get('position')!.patchValue(positionName);
  }

  selectEmployee(employee: Employee) {
    return this.employeesSelected.some((e) => e.id === employee.id);
  }

  selectAllowanceEmployee(employee: Employee) {
    return this.allowEmployeesSelected.some((e) => e.id === employee.id);
  }

  onScroll() {
    this.isEventSearch = false;
    const val = this.formGroup.value;
    this.store.dispatch(
      EmployeeAction.loadMoreEmployees({ employee: this.employee(val) })
    );
  }

  employee(val: any) {
    return {
      skip: this.pageIndex,
      take: this.pageSize,
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
