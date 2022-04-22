import {
  AfterViewInit,
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
import { EmployeeType, RecipeType, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { getAllPosition, PositionActions } from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { searchAutocomplete } from '../../../../../../../../libs/utils/orgchart.ultil';
import { pickAll, pickOne } from '../../../../../../../../libs/utils/pick-item.ultil';

@Component({
  selector: 'app-table-allowance-employee',
  templateUrl: 'table-allowance-employee.component.html'
})
export class TableAllowanceEmployeeComponent implements OnInit, OnChanges {
  @Input() employees: Employee[] = [];
  @Input() checkAllowance: boolean = false;
  @Input() allowEmployeesSelected: Employee[] = [];
  @Output() EventSelectEmployee = new EventEmitter<Employee[]>();
  @Output() EventSelectAllowance = new EventEmitter<Employee[]>();
  employeesSelected: Employee[] = [];
  isSelectAllEmployee = true;
  isSelectAllowance = true;
  differ: any;

  constructor(
    private readonly store: Store,
    private readonly snackBar: MatSnackBar
  ) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.employees) {
      if (changes.employees.currentValue.length == 0) {
        this.isSelectAllEmployee = false;
        this.isSelectAllowance = false;
      } else {
        this.isSelectAllEmployee = true;
        this.isSelectAllowance =
          this.employees !== null &&
          this.employees.every((e) => this.allowEmployeesSelected.some(item => item.id === e.id));
      }
      this.employeesSelected = [...changes.employees.currentValue];
    }
    if (changes.allowEmployeesSelected) {
      if (changes.allowEmployeesSelected.currentValue.length == 0) {
        this.isSelectAllowance = false;
      } else {
        this.isSelectAllowance =
          this.employees !== null &&
          this.employees.every((e) => this.allowEmployeesSelected.some(item => item.id === e.id));
      }
    }
  }

  ngOnInit(): void {
    this.employeesSelected = [...this.employees];
  }

  //check-box-employee
  updateSelectEmployee(employee: Employee) {
    const val = pickOne(employee, this.employeesSelected, this.employees, this.allowEmployeesSelected);
    this.isSelectAllEmployee = val.isSelectAll;
    this.isSelectAllowance = val.isSelectAllowance;
    this.EventSelectEmployee.emit(this.employeesSelected);
    this.EventSelectAllowance.emit(this.allowEmployeesSelected);
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

  selectEmployee(employee: Employee) {
    return this.employeesSelected.some((e) => e.id === employee.id);
  }

  selectAllowanceEmployee(employee: Employee) {
    return this.allowEmployeesSelected.some((e) => e.id === employee.id);
  }
}
