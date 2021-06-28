import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllEmployee } from '../../../../../apps/hr/src/app/pages/employee/+state/employee.selector';
import { EmployeeAction } from '../../../../../apps/hr/src/app/pages/employee/+state/employee.action';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Employee } from '../../../../../apps/hr/src/app/pages/employee/+state/employee.interface';


@Component({
  selector: 'app-pick-employee',
  templateUrl: './pick-employee.component.html',
  styleUrls: ['./pick-employee.component.scss']
})
export class PickEmployeeComponent implements OnInit, OnDestroy {
  @Output() checkEvent = new EventEmitter();
  type = SalaryTypeEnum;
  pageIndex: number = 1;
  pageSize: number = 30;
  allSelect = false;
  employees: Employee[] = [];
  employeeIds: number[] = [];
  search!: '';
  employees$: Observable<Employee[]> | undefined;
  destroy$: Subject<void> = new Subject();

  constructor(
    private readonly store: Store
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(EmployeeAction.loadEmployees({ RequestPaginate: { skip: 0, take: 30 }, isSelect: true }));
    this.employees$ = this.store.pipe(select(selectorAllEmployee)).pipe(
      tap(e => console.log('em', e)),
      takeUntil(this.destroy$)
    );
    this.employees$.subscribe( val =>
    this.employees = val as Employee[]
    )
  }

  onScroll() {
    this.store.dispatch(EmployeeAction.loadEmployees(
      { RequestPaginate: { skip: this.pageSize * this.pageIndex++, take: this.pageSize }, isSelect: false }));
  }

  updateAllSelect(id: number) {
    const index = this.employeeIds.indexOf(id);
    if (index > -1) {
      this.employeeIds.splice(index, 1);
    } else {
      this.employeeIds.push(id);
    }
    this.allSelect = this.employees.every(e => e.isSelect === true);
    this.checkEvent.emit(this.employeeIds);
  }

  setAll(checked: boolean) {
    this.allSelect = checked;
        this.employees.forEach(e => {
            e.isSelect = checked;
            if (checked) {
              this.employeeIds.push(e.id);
            } else {
              this.employeeIds = [];
            }
          }
        )
    this.checkEvent.emit(this.employeeIds);
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }
}
