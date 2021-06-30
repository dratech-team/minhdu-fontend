import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Employee } from '@minhdu-fontend/data-models';
import { EmployeeAction, selectorAllEmployee } from '@minhdu-fontend/employee';


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
  allSelect :boolean = false;
  employees: Employee[] = [];
  employeeIds: number[] = [];
  search!: '';
  employees$ = this.store.pipe(select(selectorAllEmployee));

  constructor(
    private readonly store: Store
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(EmployeeAction.loadEmployees({ RequestPaginate: { skip: 0, take: 30 }, isSelect: true }));
    this.employees$.subscribe(val => this.employees = JSON.parse(JSON.stringify(val)));
  }

  onScroll() {
    this.store.dispatch(EmployeeAction.loadEmployees(
      { RequestPaginate: { skip: this.pageSize * this.pageIndex++, take: this.pageSize }, isSelect: true }));
  }

  updateAllSelect(id: number) {
    const index = this.employeeIds.indexOf(id);
    if (index > -1) {
      this.employeeIds.splice(index, 1);
    } else {
      this.employeeIds.push(id);
    }
    this.allSelect = this.employees !== null && this.employees.every(e => e.isSelect)
    this.checkEvent.emit(this.employeeIds);
  }

  someComplete(): boolean {
    if(this.employees == null) {
      return false
    }
    return (
      this.employees.filter( e => e.isSelect).length > 0 && !this.allSelect
    )
  }

  setAll(select: boolean) {
    this.allSelect = select;
    if(this.employees == null){
      return;
    }
    this.employeeIds = [];
    this.employees?.forEach(employee => {
        employee.isSelect = select
        if (select) {
          this.employeeIds.push(employee.id);
        }
      }
    );
    this.checkEvent.emit(this.employeeIds);
  }

}
