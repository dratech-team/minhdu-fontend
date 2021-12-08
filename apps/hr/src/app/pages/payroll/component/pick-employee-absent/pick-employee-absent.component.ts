import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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
  selectorAllEmployee, selectorTotalEmployee
} from '@minhdu-fontend/employee';
import { getAllPosition, PositionActions } from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { sortBoolean } from '../../../../../../../../libs/utils/sortByBoolean.ultils';

@Component({
  selector: 'app-pick-employee-absent',
  templateUrl: './pick-employee-absent.component.html'
})
export class PickEmployeeAbsentComponent implements OnInit, OnChanges {
  @Input() employeeIdInit?: Employee;
  @Input() createdPayroll!: Date;
  @Output() EventSelectEmployee = new EventEmitter<number[]>();
  type = SalaryTypeEnum;
  pageSize = 30;
  pageIndex = 0;
  employees$ = this.store.pipe(select(selectorAllEmployee));
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));
  loaded$ = this.store.pipe(select(selectEmployeeLoaded));
  total$ = this.store.pipe(select(selectorTotalEmployee));
  isSelectAll = false;
  employees: Employee[] = [];
  employeesSelected: Employee[] = [];
  employeeId!: number;
  isEventSearch = false;
  formGroup = new FormGroup(
    {
      name: new FormControl('', Validators.required),
      position: new FormControl('', Validators.required),
      branch: new FormControl('', Validators.required)
    });

  constructor(
    private readonly store: Store,
    private readonly service: TimekeepingService
  ) {
  }

  ngOnInit(): void {
    if (this.employeeIdInit) {
      this.employeesSelected.push(this.employeeIdInit);
    }
    if (this.createdPayroll) {
      this.store.dispatch(EmployeeAction.loadInit(
        { employee: { take: 30, skip: 0, createdPayroll: new Date(this.createdPayroll) } }
      ));
    }
    this.employees$.subscribe(employees => {
      if (this.isEventSearch) {
        this.isSelectAll = employees.every(e =>
          this.employeesSelected.some(item => item.id === e.id)
        ) && this.employeesSelected.length > 0;
      }
      employees.forEach(employee => {
        if (this.isSelectAll) {
          if (!this.employeesSelected.some(e => e.id === employee.id)) {
            this.employeesSelected.push(Object.assign(JSON.parse(JSON.stringify(employee)), { isSelect: true }));
          }
        }
      });
      this.employees = JSON.parse(JSON.stringify(employees));
      this.employees.map(emp => {
        if (this.employeesSelected.some(item => item.id === emp.id)) {
          emp.isSelect = true;
        }
      });
      const value = this.formGroup.value;
      this.employeesSelected.map(item => {
          if (this.employees.every(e => e.id !== item.id
            && (value.name.toLowerCase().includes(item.lastName.toLowerCase()) || value.name === '')
            && (value.position.toLowerCase().includes(item.position.name.toLowerCase()) || value.position === '')
            && (value.branch.toLowerCase().includes(item.branch.name.toLowerCase()) || value.branch === ''))) {
            this.employees.push(item);
          }
        }
      );
      this.employees = sortBoolean(this.employees);
    });

    this.store.dispatch(PositionActions.loadPosition());
    this.store.dispatch(OrgchartActions.init());

    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((val) => {
        this.isEventSearch = true;
        Object.assign(val, {
          take: this.pageSize,
          skip: this.pageIndex,
          createdPayroll: new Date(this.createdPayroll)
        });
        return this.store.dispatch(EmployeeAction.loadInit({ employee: val }));
      })
    ).subscribe();

    this.positions$ = combineLatest([
      this.formGroup.get('position')!.valueChanges.pipe(startWith('')),
      this.store.pipe(select(getAllPosition))
    ]).pipe(
      map(([position, positions]) => {
        if (position) {
          return positions.filter((e) => {
            return e.name.toLowerCase().includes(position?.toLowerCase());
          });
        } else {
          return positions;
        }
      })
    );

    this.branches$ = combineLatest([
      this.formGroup.get('branch')!.valueChanges.pipe(startWith('')),
      this.branches$
    ]).pipe(
      map(([branch, branches]) => {
        if (branch) {
          return branches.filter((e) => {
            return e.name.toLowerCase().includes(branch?.toLowerCase());
          });
        } else {
          return branches;
        }
      })
    );
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.createdPayroll.previousValue !== changes.createdPayroll.currentValue) {
      this.isSelectAll = false;
      this.employeesSelected = [];
      this.EventSelectEmployee.emit(this.employeesSelected.map(e => e.id));
      this.store.dispatch(EmployeeAction.loadInit({
        employee: { createdPayroll: new Date(changes.createdPayroll.currentValue) }
      }));
    }
  }

  updateSelect(employee: Employee) {
    const index = this.employeesSelected.indexOf(employee);
    if (index > -1) {
      this.employeesSelected.splice(index, 1);
    } else {
      this.employeesSelected.push(Object.assign(employee, { isSelect: true }));
    }
    this.isSelectAll = this.employees !== null && this.employees.every(e => this.employeesSelected.includes(e));
    this.EventSelectEmployee.emit(this.employeesSelected.map(e => e.id));
  }

  someComplete(): boolean {
    return (
      this.employees.filter(e => this.employeesSelected.some(item => item.id === e.id)).length > 0 && !this.isSelectAll
    );
  }

  setAll(select: boolean) {
    this.isSelectAll = select;
    if (this.employees == null) {
      return;
    }
    this.employees?.forEach(employee => {
        if (select) {
          if (!this.employeesSelected.some(item => item.id === employee.id)) {
            this.employeesSelected.push(Object.assign(employee, { isSelect: true }));
          }
        } else {

          const index = this.employeesSelected.indexOf(employee);
          if (index > -1) {
            this.employeesSelected.splice(index, 1);
          }
        }
      }
    );
    this.EventSelectEmployee.emit(this.employeesSelected.map(e => e.id));
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
    this.store.dispatch(EmployeeAction.loadMoreEmployees({ employee: this.employee(val) }));
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

  someEmployee(employee: Employee) {
    return this.employeesSelected.some(e => e.id === employee.id);
  }
}


