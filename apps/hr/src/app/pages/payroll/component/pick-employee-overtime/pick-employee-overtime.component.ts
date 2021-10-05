import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Employee } from '@minhdu-fontend/data-models';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { PickEmployeeService } from './pick-employee.service';
import { selectorAllEmployee } from '@minhdu-fontend/employee';

@Component({
  selector: 'app-pick-employee-overtime',
  templateUrl: 'pick-employee-overtime.component.html'
})
export class PickEmployeeOvertimeComponent implements OnInit {
  @Input() checkAllowance = false;
  @Input() search!: any;
  @Output() EventSelectEmployee = new EventEmitter<number[]>();
  @Output() EventSelectAllowance = new EventEmitter<number[]>();
  employees$ = this.store.pipe(select(selectorAllEmployee));
  type = SalaryTypeEnum;
  isSelectEmployee = false;
  isSelectAllowance = false;
  employees: Employee[] = [];
  employeeIds: number[] = [];
  allowEmpIds: number[] = [];
  formGroup = new FormGroup(
    {
      name: new FormControl('')
    });

  constructor(
    private readonly store: Store,
    private readonly service: PickEmployeeService
  ) {
  }

  ngOnInit(): void {
    this.employees$.subscribe(employee => {
      this.employees = JSON.parse(JSON.stringify(employee));
    });
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((val) => {
        const param = {
          name: val.name,
          templateId: this.search.templateId,
          createdPayroll: new Date(this.search.createdPayroll),
        };
        this.service.searchEmployees(param);
      })
    ).subscribe();
  }

//check-box-employee
  updateSelectEmployee(id: number) {
    const index = this.employeeIds.indexOf(id);
    if (index > -1) {
      this.employeeIds.splice(index, 1);
    } else {
      this.employeeIds.push(id);
    }
    this.isSelectEmployee = this.employees !== null && this.employees.every(e => this.employeeIds.includes(e.id));
    this.EventSelectEmployee.emit(this.employeeIds);
  }

  someCompleteEmployee(): boolean {
    return (
      this.employees.filter(e => this.employeeIds.includes(e.id)).length > 0 && !this.isSelectEmployee
    );
  }

  setAllEmployee(select: boolean) {
    this.isSelectEmployee = select;
    if (this.employees == null) {
      return;
    }
    this.employees?.forEach(employee => {
        if (select) {
          if (!this.employeeIds.includes(employee.id)) {
            this.employeeIds.push(employee.id);
          }
        } else {
          const index = this.employeeIds.indexOf(employee.id);
          if (index > -1) {
            this.employeeIds.splice(index, 1);
          }
        }
      }
    );
    this.EventSelectEmployee.emit(this.employeeIds);
  }

//check-box-allowance
  updateSelectAllowance(id: number) {
    const index = this.allowEmpIds.indexOf(id);
    if (index > -1) {
      this.allowEmpIds.splice(index, 1);
    } else {
      this.allowEmpIds.push(id);
    }
    this.isSelectAllowance = this.employees !== null && this.employees.every(e => this.allowEmpIds.includes(e.id));
    this.EventSelectAllowance.emit(this.allowEmpIds);
  }

  someCompleteAllowance(): boolean {
    return (
      this.employees.filter(e => this.allowEmpIds.includes(e.id)).length > 0 && !this.isSelectAllowance
    );
  }

  setAllAllowance(select: boolean) {
    this.isSelectAllowance = select;
    if (this.employees == null) {
      return;
    }
    this.employees?.forEach(employee => {
        if (select) {
          if (!this.allowEmpIds.includes(employee.id)) {
            this.allowEmpIds.push(employee.id);
          }
        } else {
          const index = this.allowEmpIds.indexOf(employee.id);
          if (index > -1) {
            this.allowEmpIds.splice(index, 1);
          }
        }
      }
    );
    this.EventSelectAllowance.emit(this.allowEmpIds);
  }
}


