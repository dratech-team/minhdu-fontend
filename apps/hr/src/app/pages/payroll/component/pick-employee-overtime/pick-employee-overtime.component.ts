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
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { PickEmployeeService } from './pick-employee.service';
import { getAllPosition, PositionActions } from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { searchAutocomplete } from '../../../../../../../../libs/utils/orgchart.ultil';

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
    name: new FormControl(''),
    position: new FormControl(''),
    code: new FormControl('')
  });
  positions$ = this.store.pipe(select(getAllPosition));

  constructor(
    private readonly store: Store,
    private readonly service: PickEmployeeService,
    private readonly snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.employees$.subscribe((employee) => {
      this.employeeIds = [];
      this.allowEmpIds = [];
      this.isSelectEmployee = false;
      this.isSelectAllowance = false;
      this.employees = JSON.parse(JSON.stringify(employee));
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
          const param = {
            name: val.name,
            code: val.code,
            position: val.position,
            templateId: this.search.templateId || '',
            createdPayroll: new Date(this.search.createdPayroll),
            employeeType: this.search.employeeType || '',
            recipeType: this.search.recipeType || ''
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
      this.employeeIds = [];
      this.allowEmpIds = [];
      this.isSelectAllowance = false;
      this.isSelectEmployee = false;
      this.EventSelectAllowance.emit(this.allowEmpIds);
      this.EventSelectEmployee.emit(this.employeeIds);
      this.store.dispatch(
        EmployeeAction.loadInit({
          employee: {
            templateId: changes.search.currentValue.templateId || '',
            createdPayroll: changes.search.currentValue.createdPayroll
              ? new Date(changes.search.currentValue.createdPayroll)
              : new Date(),
            employeeType: changes.search.currentValue.employeeType || '',
            recipeType: changes.search.currentValue.recipeType || ''
          }
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
    this.isSelectAllowance =
      this.employees !== null &&
      this.employees.every((e) => this.allowEmpIds.includes(e.id));
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
    this.employees?.forEach((employee) => {
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

  onSelectPosition(positionName: string) {
    this.formGroup.get('position')!.patchValue(positionName);
  }
}
