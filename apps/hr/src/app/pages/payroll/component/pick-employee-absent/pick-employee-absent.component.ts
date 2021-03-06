import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Employee } from '@minhdu-fontend/data-models';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { TimekeepingService } from './timekeeping.service';
import { of } from 'rxjs';
import {
  EmployeeAction,
  selectEmployeeLoaded,
  selectorAllEmployee,
  selectorTotalEmployee,
} from '@minhdu-fontend/employee';
import {
  getAllPosition,
  PositionActions,
} from '@minhdu-fontend/orgchart-position';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { searchAutocomplete } from '@minhdu-fontend/utils';
import {
  checkIsSelectAllInit,
  handleValSubPickItems,
  pickAll,
  pickOne,
  someComplete,
} from '@minhdu-fontend/utils';

@Component({
  selector: 'app-pick-employee-deduction',
  templateUrl: './pick-employee-absent.component.html',
})
export class PickEmployeeAbsentComponent
  implements OnInit, OnChanges, OnChanges
{
  @Input() employeeInit?: Employee;
  @Input() createdPayroll!: Date;
  @Input() employeesSelected: Employee[] = [];
  @Output() EventSelectEmployee = new EventEmitter<Employee[]>();

  pageSize = 30;
  pageIndex = 0;
  type = SalaryTypeEnum;
  employees: Employee[] = [];
  employeeId!: number;
  isEventSearch = false;
  isSelectAll = false;

  employees$ = this.store.pipe(select(selectorAllEmployee));
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));
  loaded$ = this.store.pipe(select(selectEmployeeLoaded));
  total$ = this.store.pipe(select(selectorTotalEmployee));

  formGroup = new UntypedFormGroup({
    name: new UntypedFormControl('', Validators.required),
    position: new UntypedFormControl('', Validators.required),
    branch: new UntypedFormControl('', Validators.required),
  });

  constructor(
    private readonly store: Store,
    private readonly service: TimekeepingService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.employeesSelected) {
      this.isSelectAll =
        this.employees.length > 1 &&
        this.employees.every((e) =>
          this.employeesSelected.some((item) => item.id === e.id)
        );
    }

    if (
      changes.createdPayroll?.previousValue !==
      changes.createdPayroll?.currentValue
    ) {
      this.isSelectAll = false;
      this.employeesSelected = [];
      this.EventSelectEmployee.emit(this.employeesSelected);
      this.store.dispatch(
        EmployeeAction.loadInit({
          employee: {
            take: 30,
            skip: 0,
            createdPayroll: new Date(changes.createdPayroll.currentValue),
          },
        })
      );
    }
  }

  ngOnInit(): void {
    if (this.employeeInit) {
      this.employeesSelected.push(this.employeeInit);
      this.EventSelectEmployee.emit(this.employeesSelected);
    }
    this.employees$.subscribe((employees) => {
      if (employees.length === 0) {
        this.isSelectAll = false;
      }
      if (this.isEventSearch) {
        this.isSelectAll = checkIsSelectAllInit(
          employees,
          this.employeesSelected
        );
      }

      this.employees = handleValSubPickItems(
        employees,
        this.employees,
        this.employeesSelected,
        this.isSelectAll
      );
      const value = this.formGroup.value;
    });
    this.store.dispatch(PositionActions.loadPosition());

    this.store.dispatch(OrgchartActions.init());

    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.isEventSearch = true;
          Object.assign(val, {
            take: this.pageSize,
            skip: this.pageIndex,
            createdPayroll: new Date(this.createdPayroll),
          });
          return this.store.dispatch(
            EmployeeAction.loadInit({ employee: val })
          );
        })
      )
      .subscribe();

    this.positions$ = searchAutocomplete(
      this.formGroup.get('position')?.valueChanges.pipe(startWith('')) ||
        of(''),
      this.store.pipe(select(getAllPosition))
    );

    this.branches$ = searchAutocomplete(
      this.formGroup.get('branch')?.valueChanges.pipe(startWith('')) || of(''),
      this.branches$
    );
  }

  updateSelect(employee: Employee) {
    this.isSelectAll = pickOne(
      employee,
      this.employeesSelected,
      this.employees
    ).isSelectAll;
    this.EventSelectEmployee.emit(this.employeesSelected);
  }

  someComplete(): boolean {
    return someComplete(
      this.employees,
      this.employeesSelected,
      this.isSelectAll
    );
  }

  setAll(select: boolean) {
    this.isSelectAll = select;
    pickAll(select, this.employees, this.employeesSelected);
    this.EventSelectEmployee.emit(this.employeesSelected);
  }

  onSelectPosition(positionName: string) {
    this.formGroup.get('position')?.patchValue(positionName);
  }

  onSelectBranch(branchName: string) {
    this.formGroup.get('branch')?.patchValue(branchName);
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
      branch: val.branch,
      createdPayroll: new Date(this.createdPayroll),
    };
  }

  checkEmployee(employee: Employee) {
    return this.employeesSelected.some((e) => e.id === employee.id);
  }
}
