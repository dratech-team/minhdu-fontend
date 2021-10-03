import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Employee, Position } from '@minhdu-fontend/data-models';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, map, startWith, tap } from 'rxjs/operators';
import { TimekeepingService } from './timekeeping.service';
import { combineLatest } from 'rxjs';
import { EmployeeAction, selectorAllEmployee } from '@minhdu-fontend/employee';
import { getAllPosition, PositionActions } from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';

@Component({
  selector: 'app-pick-employee-absent',
  templateUrl: './pick-employee-absent.component.html'
})
export class PickEmployeeAbsentComponent implements OnInit {
  @Output() EventSelectEmployee = new EventEmitter<number[]>();
  type = SalaryTypeEnum;
  employees$ = this.store.pipe(select(selectorAllEmployee));
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));
  isSelectAll = false;
  employees: Employee[] = [];
  employeeIds: number[] = [];
  employeeId!: number;
  formGroup = new FormGroup(
    {
      name: new FormControl(''),
      position : new FormControl(''),
      branch : new FormControl(''),
    });

  constructor(
    private readonly store: Store,
    private readonly service: TimekeepingService
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(EmployeeAction.loadInit({}));
    this.employees$.subscribe(employee => {
      this.employees = JSON.parse(JSON.stringify(employee));
      this.assignIsSelect();
    });
    this.store.dispatch(PositionActions.loadPosition());
    this.store.dispatch(OrgchartActions.init());
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((val) => {
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

  assignIsSelect() {
    this.employees.forEach(e => {
      e.isSelect = this.employeeIds.includes(e.id);
    });
    if (this.isSelectAll) {
      this.employees.forEach(e => {
        if (!this.employeeIds.includes(e.id))
          this.employeeIds.push(e.id);
      });
    } else {
      this.employees.forEach(e => {
        e.isSelect = this.employeeIds.includes(e.id);
      });
    }
  }

  updateSelect(id: number) {
    const index = this.employeeIds.indexOf(id);
    if (index > -1) {
      this.employeeIds.splice(index, 1);
    } else {
      this.employeeIds.push(id);
    }
    this.isSelectAll = this.employees !== null && this.employees.every(e => e.isSelect);
    this.EventSelectEmployee.emit(this.employeeIds);
  }

  someComplete(): boolean {
    return (
      this.employees.filter(e => e.isSelect).length > 0 && !this.isSelectAll
    );
  }

  setAll(select: boolean) {
    this.isSelectAll = select;
    if (this.employees == null) {
      return;
    }
    this.employees?.forEach(employee => {
        employee.isSelect = select;
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


