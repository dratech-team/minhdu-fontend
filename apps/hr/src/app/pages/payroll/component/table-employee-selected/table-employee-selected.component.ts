import {
  Component, DoCheck,
  EventEmitter,
  Input, IterableDiffers,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Employee } from '@minhdu-fontend/data-models';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, map, startWith, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import {
  EmployeeAction,
  selectEmployeeLoaded,
  selectorAllEmployee,
  selectorTotalEmployee
} from '@minhdu-fontend/employee';
import {
  getAllPosition,
  PositionActions
} from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { sortBoolean } from '../../../../../../../../libs/utils/sortByBoolean.ultils';

@Component({
  selector: 'app-table-employee-selected',
  templateUrl: './table-employee-selected.component.html'
})
export class TableEmployeeSelectedComponent implements OnInit, OnChanges {
  @Input() employees: Employee[] = [];
  @Output() EventSelectEmployee = new EventEmitter<Employee[]>();
  type = SalaryTypeEnum;
  isSelectAll = true;
  employeesSelected: Employee[] = [];
  employeeId!: number;
  isEventSearch = false;
  differ: any;

  constructor(
    private differs: IterableDiffers,
    private readonly store: Store
  ) {
    this.differ = differs.find([]).create(undefined);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.employees) {
      this.isSelectAll = changes.employees.currentValue.length > 0;
      this.employeesSelected = this.employees;
    }
  }

  ngOnInit(): void {
    if (this.employees.length === 0) {
      this.isSelectAll = false;
    }
    this.employeesSelected = this.employees;
  }


  updateSelect(employee: Employee) {
    const index = this.employeesSelected.findIndex(emp => emp.id === employee.id);
    if (index > -1) {
      this.employeesSelected.splice(index, 1);
    } else {
      this.employeesSelected.push(Object.assign(employee, { isSelect: true }));
    }
    this.isSelectAll =
      this.employees.length !== 0 &&
      this.employees.every((e) => this.employeesSelected.includes(e));
    this.EventSelectEmployee.emit(this.employeesSelected);
  }


  setAll(select: boolean) {
    this.isSelectAll = select;
    if (this.employees == null) {
      return;
    }
    this.employees?.forEach((employee) => {
      if (select) {
        if (!this.employeesSelected.some((item) => item.id === employee.id)) {
          this.employeesSelected.push(
            Object.assign(employee, { isSelect: true })
          );
        }
      } else {
        this.employeesSelected = [];
      }
    });
    this.EventSelectEmployee.emit(this.employeesSelected);
  }

  selectEmployee(employee: Employee) {
    return this.employeesSelected.some((e) => e.id === employee.id);
  }
}
