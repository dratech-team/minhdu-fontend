import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllEmployee } from '../../../../../apps/hr/src/app/pages/employee/+state/employee.selector';
import { EmployeeAction } from '../../../../../apps/hr/src/app/pages/employee/+state/employee.action';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';


@Component({
  selector: 'app-pick-employee',
  templateUrl: './pick-employee.component.html',
  styleUrls: ['./pick-employee.component.scss']
})
export class PickEmployeeComponent implements OnInit {
  @Output() checkEvent = new EventEmitter();
  type = SalaryTypeEnum;
  pageIndex: number = 1;
  pageSize: number = 30;
  allSelect = false;
  employeeIds: number[] = [];
  search!: '';
  employees$ = this.store.pipe(select(selectorAllEmployee));

  constructor(
    private readonly store: Store
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(EmployeeAction.loadEmployees({RequestPaginate:{ skip: 0, take: 30 }, isSelect: true}));
  }

  onScroll() {
    this.store.dispatch(EmployeeAction.loadEmployees(
      {RequestPaginate:{ skip: this.pageSize * this.pageIndex++, take: this.pageSize }, isSelect:false}));
  }

  updateAllSelect(id: number) {
    const index = this.employeeIds.indexOf(id);
    if (index > -1) {
      this.employeeIds.splice(index, 1);
    } else {
      this.employeeIds.push(id);
    }
    this.employees$.subscribe(
      employees => this.allSelect = employees.every(e => e.isSelect === true));
    this.checkEvent.emit(this.employeeIds);
  }

  setAll(checked: boolean) {
    this.allSelect = checked;
    this.employees$.subscribe(
      employees =>
        employees.forEach(e => {
            if (checked) {
              this.employeeIds.push(e.id);
            } else {
              this.employeeIds = [];
            }
            e.isSelect = checked;
          }
        )
    );
    this.checkEvent.emit(this.employeeIds);
  }
}
