import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Employee } from '@minhdu-fontend/data-models';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { EmployeeAction, selectorAllEmployee } from '@minhdu-fontend/employee';




@Component({
  selector: 'app-pick-employee',
  templateUrl: './pick-employee.component.html',
})
export class PickEmployeeComponent implements OnInit {

  @Output() checkEvent = new EventEmitter();
  type = SalaryTypeEnum;
  pageIndex: number = 1;
  pageSize: number = 30;
  selectAll: boolean = false;
  employees: Employee[] = [];
  employeeIds: number[] = [];
  employees$ = this.store.pipe(select(selectorAllEmployee));
  code?: string;
  name?: string;
  position?: string;
  formGroup = new FormGroup(
    {
      code: new FormControl(''),
      name: new FormControl(''),
      branch: new FormControl(''),
    })
  constructor(
    private readonly store: Store
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(EmployeeAction.loadInit({ skip: 0, take: 30 }));
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((val) => {
        this.store.dispatch(EmployeeAction.loadInit({
          skip: 0,
          take: 30,
          code: val.code,
          name: val.name,
          position: val.position,
        }));
      })
    ).subscribe()
    this.employees$.subscribe(val =>{
      this.employees = JSON.parse(JSON.stringify(val))
      this.employees.map(e => e.isSelect = this.selectAll)
    });
  }

  onScroll() {
    const val = this.formGroup.value
    this.store.dispatch(EmployeeAction.loadMoreEmployees({
      skip: this.pageSize * this.pageIndex++,
      take: this.pageSize,
      code: val.code,
      name: val.name,
      position: val.position,
    }));
  }


  updateAllSelect(id: number) {
    const index = this.employeeIds.indexOf(id);
    if (index > -1) {
      this.employeeIds.splice(index, 1);
    } else {
      this.employeeIds.push(id);
    }
    this.selectAll = this.employees !== null && this.employees.every(e => e.isSelect);
    this.checkEvent.emit(this.employeeIds);
  }

  someComplete(): boolean {
    if (this.employees == null) {
      return false;
    }
    return (
      this.employees.filter(e => e.isSelect).length > 0 && !this.selectAll
    );
  }

  setAll(select: boolean) {
    this.selectAll = select;
    if (this.employees == null) {
      return;
    }
    this.employeeIds = [];
    this.employees?.forEach(employee => {
        employee.isSelect = select;
        if (select) {
          this.employeeIds.push(employee.id);
        }
      }
    );
    this.checkEvent.emit(this.employeeIds);
  }

}


