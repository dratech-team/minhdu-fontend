import {
  Component, DoCheck,
  EventEmitter,
  Input,
  IterableDiffers,
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
import { TimekeepingService } from './timekeeping.service';
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
import { searchAutocomplete } from '../../../../../../../../libs/utils/orgchart.ultil';

@Component({
  selector: 'app-pick-employee-absent',
  templateUrl: './pick-employee-absent.component.html'
})
export class PickEmployeeAbsentComponent implements OnInit, OnChanges, DoCheck {
  @Input() employeeInit?: Employee;
  @Input() createdPayroll!: Date;
  @Input() isSelectAll!: boolean;
  @Input() employeesSelected: Employee[] = [];
  @Output() EventSelectEmployee = new EventEmitter<Employee[]>();
  type = SalaryTypeEnum;
  pageSize = 30;
  pageIndex = 0;
  employees$ = this.store.pipe(select(selectorAllEmployee));
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));
  loaded$ = this.store.pipe(select(selectEmployeeLoaded));
  total$ = this.store.pipe(select(selectorTotalEmployee));
  employees: Employee[] = [];
  employeeId!: number;
  isEventSearch = false;
  differ: any
  formGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    position: new FormControl('', Validators.required),
    branch: new FormControl('', Validators.required)
  });

  constructor(
    private differs: IterableDiffers,
    private readonly store: Store,
    private readonly service: TimekeepingService
  ) {
    this.differ = differs.find([]).create(undefined);
  }

  ngOnInit(): void {
    if (this.employeeInit) {
      this.employeesSelected.push(this.employeeInit);
    }
    if (this.createdPayroll) {
      this.store.dispatch(
        EmployeeAction.loadInit({
          employee: {
            take: 30,
            skip: 0,
            createdPayroll: new Date(this.createdPayroll)
          }
        })
      );
    }
    this.employees$.subscribe((employees) => {
      if (this.isEventSearch) {
        this.isSelectAll =
          employees.every((e) =>
            this.employeesSelected.some((item) => item.id === e.id)
          ) && this.employeesSelected.length > 0;
      }
      employees.forEach((employee) => {
        if (this.isSelectAll) {
          if (!this.employeesSelected.some((e) => e.id === employee.id)) {
            this.employeesSelected.push(employee);
          }
        }
      });
      this.employees = JSON.parse(JSON.stringify(employees));
      const value = this.formGroup.value;
      this.employeesSelected.map((item) => {
        if (
          this.employees.every(
            (e) =>
              e.id !== item.id &&
              (value.name.toLowerCase().includes(item.lastName.toLowerCase()) ||
                value.name === '') &&
              (value.position
                  .toLowerCase()
                  .includes(item.position.name.toLowerCase()) ||
                value.position === '') &&
              (value.branch
                  .toLowerCase()
                  .includes(item.branch.name.toLowerCase()) ||
                value.branch === '')
          )
        ) {
          this.employees.push(item);
        }
      });
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
            createdPayroll: new Date(this.createdPayroll)
          });
          return this.store.dispatch(
            EmployeeAction.loadInit({ employee: val })
          );
        })
      )
      .subscribe();

    this.positions$ = searchAutocomplete(
      this.formGroup.get('position')!.valueChanges.pipe(startWith('')),
      this.store.pipe(select(getAllPosition))
    );

    this.branches$ = searchAutocomplete(
      this.formGroup.get('branch')!.valueChanges.pipe(startWith('')),
      this.branches$
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
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
            createdPayroll: new Date(changes.createdPayroll.currentValue)
          }
        })
      );
    }
  }

  ngDoCheck() {
    const employeeSelectedChange = this.differ.diff(this.employeesSelected)
    if(employeeSelectedChange){
      this.isSelectAll =
        this.employees !== null &&
        this.employees.every((e) => this.employeesSelected.includes(e));
    }
  }

  updateSelect(employee: Employee) {
    const index = this.employeesSelected.indexOf(employee);
    if (index > -1) {
      this.employeesSelected.splice(index, 1);
    } else {
      this.employeesSelected.push(Object.assign(employee, { isSelect: true }));
    }
    this.isSelectAll =
      this.employees !== null &&
      this.employees.every((e) => this.employeesSelected.includes(e));
    this.EventSelectEmployee.emit(this.employeesSelected);
  }

  someComplete(): boolean {
    return (
      this.employees.filter((e) =>
        this.employeesSelected.some((item) => item.id === e.id)
      ).length > 0 && !this.isSelectAll
    );
  }

  setAll(select: boolean) {
    this.isSelectAll = select;
    if (this.employees == null) {
      return;
    }
    this.employees?.forEach((employee) => {
      if (select) {
        if (!this.employeesSelected.some((item) => item.id === employee.id)) {
          this.employeesSelected.push(employee);
        }
      } else {
        const index = this.employeesSelected.indexOf(employee);
        if (index > -1) {
          this.employeesSelected.splice(index, 1);
        }
      }
    });
    this.EventSelectEmployee.emit(this.employeesSelected);
  }

  onSelectPosition(positionName: string) {
    this.formGroup.get('position')!.patchValue(positionName);
  }

  onSelectBranch(branchName: string) {
    this.formGroup.get('branch')!.patchValue(branchName);
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
      createdPayroll: new Date(this.createdPayroll)
    };
  }

  selectEmployee(employee: Employee) {
    return this.employeesSelected.some((e) => e.id === employee.id);
  }
}
