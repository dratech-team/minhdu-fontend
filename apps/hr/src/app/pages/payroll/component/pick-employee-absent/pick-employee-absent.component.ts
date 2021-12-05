import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Employee } from '@minhdu-fontend/data-models';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, map, startWith, tap } from 'rxjs/operators';
import { TimekeepingService } from './timekeeping.service';
import { combineLatest } from 'rxjs';
import {
  EmployeeAction,
  selectEmployeeLoaded,
  selectorAllEmployee
} from '@minhdu-fontend/employee';
import { getAllPosition, PositionActions } from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';

@Component({
  selector: 'app-pick-employee-absent',
  templateUrl: './pick-employee-absent.component.html'
})
export class PickEmployeeAbsentComponent implements OnInit, OnChanges {
  @Input() employeeIdInit?: number;
  @Input() createdPayroll!: Date;
  @Output() EventSelectEmployee = new EventEmitter<number[]>();
  type = SalaryTypeEnum;
  employees$ = this.store.pipe(select(selectorAllEmployee));
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));
  loaded$ = this.store.pipe(select(selectEmployeeLoaded));
  isSelectAll = false;
  employees: Employee[] = [];
  employeeIds: number[] = [];
  employeeId!: number;
  formGroup = new FormGroup(
    {
      name: new FormControl(''),
      position: new FormControl(''),
      branch: new FormControl('')
    });

  constructor(
    private readonly store: Store,
    private readonly service: TimekeepingService
  ) {
  }

  ngOnInit(): void {
    if(this.employeeIdInit){
      this.employeeIds.push(this.employeeIdInit)
    }
    if (this.createdPayroll) {
      this.store.dispatch(EmployeeAction.loadInit(
        {employee: { createdPayroll: new Date(this.createdPayroll)} }
      ));
    }
    this.employees$.subscribe(employee => {
      this.employeeIds = [];
      this.isSelectAll = false;
      this.employees = JSON.parse(JSON.stringify(employee));
    });
    this.store.dispatch(PositionActions.loadPosition());
    this.store.dispatch(OrgchartActions.init());

    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((val) => {
        Object.assign(val, { createdPayroll: new Date(this.createdPayroll) });
        this.service.searchEmployees(val);
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
      this.isSelectAll = false
      this.employeeIds = []
      this.EventSelectEmployee.emit(this.employeeIds)
      this.store.dispatch(EmployeeAction.loadInit({
        employee:{createdPayroll: new Date(changes.createdPayroll.currentValue) }
      }));
    }
  }

  updateSelect(id: number) {
    const index = this.employeeIds.indexOf(id);
    if (index > -1) {
      this.employeeIds.splice(index, 1);
    } else {
      this.employeeIds.push(id);
    }
    this.isSelectAll = this.employees !== null && this.employees.every(e => this.employeeIds.includes(e.id));
    this.EventSelectEmployee.emit(this.employeeIds);
  }

  someComplete(): boolean {
    return (
      this.employees.filter(e => this.employeeIds.includes(e.id)).length > 0 && !this.isSelectAll
    );
  }

  setAll(select: boolean) {
    this.isSelectAll = select;
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

  onSelectPosition(positionName: string) {
    this.formGroup.get('position')!.patchValue(positionName);
  }

  onSelectBranch(branchName: string) {
    this.formGroup.get('branch')!.patchValue(branchName);
  }
}


