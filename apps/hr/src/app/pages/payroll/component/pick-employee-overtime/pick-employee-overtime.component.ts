import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Employee } from '@minhdu-fontend/data-models';
import { EmployeeAction, selectEmployeeLoaded, selectorAllEmployee } from '@minhdu-fontend/employee';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { debounceTime, tap } from 'rxjs/operators';
import { PickEmployeeService } from './pick-employee.service';

@Component({
  selector: 'app-pick-employee-overtime',
  templateUrl: 'pick-employee-overtime.component.html'
})
export class PickEmployeeOvertimeComponent implements OnInit, OnChanges {
  @Input() checkAllowance = false;
  @Input() search: any;
  @Output() EventSelectEmployee = new EventEmitter<number[]>();
  @Output() EventSelectAllowance = new EventEmitter<number[]>();
  employees$ = this.store.pipe(select(selectorAllEmployee));
  loaded$ = this.store.pipe(select(selectEmployeeLoaded));
  type = SalaryTypeEnum;
  isSelectEmployee = false;
  isSelectAllowance = false;
  employees: Employee[] = [];
  employeeIds: number[] = [];
  allowEmpIds: number[] = [];
  formGroup = new FormGroup({
    name: new FormControl('')
  });

  constructor(
    private readonly store: Store,
    private readonly service: PickEmployeeService,
    private readonly snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.employees$.subscribe((employee) => {
      this.employees = JSON.parse(JSON.stringify(employee));
    });
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          const param = {
            name: val.name,
            templateId: this.search.templateId,
            createdPayroll: new Date(this.search.createdPayroll)
          };
          this.service.searchEmployees(param);
        })
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    const currentTemplateId = changes.search?.currentValue?.templateId;
    const previousTemplateId = changes.search?.previousValue?.templateId;

    const currentCreatedPayroll = changes.search?.currentValue?.createdPayroll;
    const previousCreatedPayroll =
      changes.search?.previousValue?.createdPayroll;

    console.log(changes);
    if (
      currentTemplateId &&
      (currentTemplateId !== previousTemplateId ||
        currentCreatedPayroll !== previousCreatedPayroll)
    ) {
      this.store.dispatch(
        EmployeeAction.loadInit({
          templateId: changes.search.currentValue.templateId,
          createdPayroll: new Date(changes.search.currentValue.createdPayroll)
        })
      );
    }
  }

  //check-box-employee
  updateSelectEmployee(id: number) {
    const index = this.employeeIds.indexOf(id);
    const indexAllowance = this.allowEmpIds.indexOf(id);
    if (index > -1) {
      this.employeeIds.splice(index, 1);
      if (indexAllowance > -1) {
        this.allowEmpIds.splice(indexAllowance, 1);
      }
    } else {
      this.employeeIds.push(id);
    }
    this.isSelectEmployee =
      this.employees !== null &&
      this.employees.every((e) => this.employeeIds.includes(e.id));
    this.isSelectAllowance = this.employees !== null && this.employees.every(e => this.allowEmpIds.includes(e.id));
    this.EventSelectEmployee.emit(this.employeeIds);
    this.EventSelectAllowance.emit(this.allowEmpIds);
  }

  someCompleteEmployee(): boolean {
    return (
      this.employees.filter((e) => this.employeeIds.includes(e.id)).length >
      0 && !this.isSelectEmployee
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
        this.isSelectAllowance = select;
        const index = this.employeeIds.indexOf(employee.id);
        const indexAllowance = this.allowEmpIds.indexOf(employee.id);
        if (index > -1) {
          this.employeeIds.splice(index, 1);
          if (indexAllowance > -1) {
            this.allowEmpIds.splice(indexAllowance, 1);
          }
        }
      }
      this.EventSelectAllowance.emit(this.allowEmpIds);
      this.EventSelectEmployee.emit(this.employeeIds);
    });
  }

  //check-box-allowance
  updateSelectAllowance(id: number) {
    const index = this.allowEmpIds.indexOf(id);
    if (index > -1) {
      this.allowEmpIds.splice(index, 1);
    } else {
      if (this.employeeIds.includes(id)) {
        this.allowEmpIds.push(id);
      } else {
        this.snackBar.open(
          'Phụ cấp chỉ được chọn khi nhân viên được chọn. Xin cảm ơn.',
          'Đã hiểu'
        );
      }
    }
    this.isSelectAllowance =
      this.employees !== null &&
      this.employees.every((e) => this.allowEmpIds.includes(e.id));
    this.EventSelectAllowance.emit(this.allowEmpIds);
  }

  someCompleteAllowance(): boolean {
    return (
      this.employees.filter((e) => this.allowEmpIds.includes(e.id)).length >
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
        if (!this.allowEmpIds.includes(employee.id)) {
          this.allowEmpIds.push(employee.id);
        }
      } else {
        const index = this.allowEmpIds.indexOf(employee.id);
        if (index > -1) {
          this.allowEmpIds.splice(index, 1);
        }
      }
    });
    this.EventSelectAllowance.emit(this.allowEmpIds);
  }
}
