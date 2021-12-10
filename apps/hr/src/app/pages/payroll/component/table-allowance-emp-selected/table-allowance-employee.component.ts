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
      this.employeesSelected = this.employees;
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
    this.employeesSelected = this.employees;
  }

  //check-box-employee
  updateSelectEmployee(employee: Employee) {
    const index = this.employeesSelected.findIndex(emp => emp.id === employee.id);
    const indexAllowance = this.allowEmployeesSelected.findIndex(emp => emp.id === employee.id);
    if (index > -1) {
      this.employeesSelected.splice(index, 1);
      if (indexAllowance > -1) {
        this.allowEmployeesSelected.splice(indexAllowance, 1);
      }
    } else {
      this.employeesSelected.push(employee);
    }
    this.isSelectAllEmployee =
      this.employees !== null &&
      this.employees.every((e) => this.employeesSelected.some(item => item.id === e.id));
    this.isSelectAllowance =
      this.employees !== null &&
      this.employees.every((e) => this.allowEmployeesSelected.some(item => item.id === e.id));
    this.EventSelectEmployee.emit(this.employeesSelected);
    this.EventSelectAllowance.emit(this.allowEmployeesSelected);
  }


  setAllEmployee(select: boolean) {
    this.isSelectAllEmployee = select;
    if (this.employees == null) {
      return;
    }
    this.employees?.forEach((employee) => {
      if (select) {
        if (!this.employeesSelected.some(emp => emp.id === employee.id)) {
          this.employeesSelected.push(employee);
        }
      } else {
        this.isSelectAllEmployee = false;
        this.employeesSelected = [];
        this.allowEmployeesSelected = [];
      }
    });
    this.EventSelectAllowance.emit(this.allowEmployeesSelected);
    this.EventSelectEmployee.emit(this.employeesSelected);
  }

  //check-box-allowance
  updateSelectAllowance(employee: Employee) {
    const index = this.allowEmployeesSelected.findIndex(emp => emp.id === employee.id);
    if (index > -1) {
      this.allowEmployeesSelected.splice(index, 1);
    } else {
      if (this.employeesSelected.some(e => e.id === employee.id)) {
        this.allowEmployeesSelected.push(employee);
      } else {
        this.snackBar.open(
          'Phụ cấp chỉ được chọn khi nhân viên được chọn. Xin cảm ơn.',
          'Đã hiểu'
        );
      }
    }
    this.isSelectAllowance =
      this.employees !== null &&
      this.employees.every((e) => this.allowEmployeesSelected.some(item => item.id === e.id));
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
    if (this.employees == null) {
      return;
    }
    this.employees?.forEach((employee) => {
      if (select) {
        if (!this.allowEmployeesSelected.some(emp => emp.id === employee.id)) {
          this.allowEmployeesSelected.push(employee);
        }
      } else {
        const index = this.allowEmployeesSelected.findIndex(emp => emp.id === employee.id);
        ;
        if (index > -1) {
          this.allowEmployeesSelected.splice(index, 1);
        }
      }
    });
    this.EventSelectAllowance.emit(this.allowEmployeesSelected);
  }

  selectEmployee(employee: Employee) {
    return this.employeesSelected.some((e) => e.id === employee.id);
  }

  selectAllowanceEmployee(employee: Employee) {
    return this.allowEmployeesSelected.some((e) => e.id === employee.id);
  }
}
