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
import {
  EmployeeAction,
  selectEmployeeLoaded,
  selectorAllEmployee
} from '@minhdu-fontend/employee';
import { EmployeeType, RecipeType, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { debounceTime, tap } from 'rxjs/operators';
import { PickEmployeeService } from './pick-employee.service';

@Component({
  selector: 'app-update-employee-overtime',
  templateUrl: 'update-employee-overtime.component.html'
})
export class UpdateEmployeeOvertimeComponent implements OnInit {
  @Input() checkAllowance = false;
  @Input() search: any;
  @Output() EventSelectSalary = new EventEmitter<number[]>();
  @Output() EventSelectAllowance = new EventEmitter<number[]>();
  type = SalaryTypeEnum;
  isSelectEmployee = false;
  isSelectAllowance = false;
  employees: any[] = [];
  salaryIds: number[] = [];
  allowSalaryIds: number[] = [];
  formGroup = new FormGroup({
    name: new FormControl('')
  });
  loaded = false

  constructor(
    private readonly store: Store,
    private readonly service: PickEmployeeService,
    private readonly snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.service.onInit({
      title: this.search.overtimeTitle || '',
      datetime: this.search.createdPayroll,
      times: this.search.times || '',
      unit: this.search.unit || ''
    }).subscribe((employee) => {
      this.loaded = true
      this.employees = JSON.parse(JSON.stringify(employee));
    });
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          const param = {
            name: val.name,
            title: this.search.overtimeTitle || '',
            datetime: this.search.createdPayroll,
            times: this.search.times || '',
            unit: this.search.unit || ''
          };
          this.loaded = false
          this.service.onInit(param).subscribe((employee) => {
            this.loaded = true
            this.employees = JSON.parse(JSON.stringify(employee));
          });
        })
      )
      .subscribe();
  }

  //check-box-employee
  updateSelectEmployee(id: number) {
    const index = this.salaryIds.indexOf(id);
    const indexAllowance = this.allowSalaryIds.indexOf(id);
    if (index > -1) {
      this.salaryIds.splice(index, 1);
      if (indexAllowance > -1) {
        this.allowSalaryIds.splice(indexAllowance, 1);
      }
    } else {
      this.salaryIds.push(id);
    }
    this.isSelectEmployee =
      this.employees !== null &&
      this.employees.every((e) => this.salaryIds.includes(e.salary.id));
    this.isSelectAllowance =
      this.employees !== null &&
      this.employees.every((e) => this.allowSalaryIds.includes(e.salary.id));
    this.EventSelectSalary.emit(this.salaryIds);
    this.EventSelectAllowance.emit(this.allowSalaryIds);
  }

  someCompleteEmployee(): boolean {
    return (
      this.employees.filter((e) => this.salaryIds.includes(e.salary.id)).length >
      0 && !this.isSelectEmployee
    );
  }

  setAllEmployee(select: boolean) {
    this.isSelectEmployee = select;
    if (this.employees == null) {
      return;
    }
    this.employees?.forEach((item) => {
      if (select) {
        if (!this.salaryIds.includes(item.salary.id)) {
          this.salaryIds.push(item.salary.id);
        }
      } else {
        this.isSelectAllowance = select;
        const index = this.salaryIds.indexOf(item.salary.id);
        const indexAllowance = this.allowSalaryIds.indexOf(item.salary.id);
        if (index > -1) {
          this.salaryIds.splice(index, 1);
          if (indexAllowance > -1) {
            this.allowSalaryIds.splice(indexAllowance, 1);
          }
        }
      }
      this.EventSelectAllowance.emit(this.allowSalaryIds);
      this.EventSelectSalary.emit(this.salaryIds);
    });
  }

  //check-box-allowance
  updateSelectAllowance(id: number) {
    const index = this.allowSalaryIds.indexOf(id);
    if (index > -1) {
      this.allowSalaryIds.splice(index, 1);
    } else {
      if (this.salaryIds.includes(id)) {
        this.allowSalaryIds.push(id);
      } else {
        this.snackBar.open(
          'Phụ cấp chỉ được chọn khi nhân viên được chọn. Xin cảm ơn.',
          'Đã hiểu'
        );
      }
    }
    this.isSelectAllowance =
      this.employees !== null &&
      this.employees.every((e) => this.allowSalaryIds.includes(e.salary.id));
    this.EventSelectAllowance.emit(this.allowSalaryIds);
  }

  someCompleteAllowance(): boolean {
    return (
      this.employees.filter((e) => this.allowSalaryIds.includes(e.salary.id)).length >
      0 && !this.isSelectAllowance
    );
  }

  setAllAllowance(select: boolean) {
    this.isSelectAllowance = select;
    if (this.employees == null) {
      return;
    }
    this.employees?.forEach((item) => {
      if (select) {
        if (!this.allowSalaryIds.includes(item.salary.id)) {
          this.allowSalaryIds.push(item.salary.id);
        }
      } else {
        const index = this.allowSalaryIds.indexOf(item.salary.id);
        if (index > -1) {
          this.allowSalaryIds.splice(index, 1);
        }
      }
    });
    this.EventSelectAllowance.emit(this.allowSalaryIds);
  }
}
