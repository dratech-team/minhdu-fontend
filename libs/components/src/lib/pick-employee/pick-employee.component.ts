import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Employee } from '@minhdu-fontend/data-models';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { PickEmployeeService } from './pick-employee.service';

@Component({
  selector: 'app-pick-employee',
  templateUrl: './pick-employee.component.html'
})
export class PickEmployeeComponent implements OnInit {

  @Output() checkEvent = new EventEmitter();
  type = SalaryTypeEnum;
  pageIndex: number = 1;
  pageSize: number = 30;
  isSelectAll: boolean = false;
  employees: Employee[] = [];
  employeeIds: number[] = [];
  code?: string;
  name?: string;
  position?: string;
  formGroup = new FormGroup(
    {
      code: new FormControl(''),
      name: new FormControl(''),
      branch: new FormControl('')
    });

  constructor(
    private readonly store: Store,
    private readonly service: PickEmployeeService
  ) {
  }

  ngOnInit(): void {
    this.service.onInit();
    this.assignIsSelect();
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((val) => {
        const search = {
          skip: 0,
          take: 30,
          code: val.code,
          name: val.name,
          branch: val.branch
        };
        this.service.searchEmployees(search);
        this.assignIsSelect();
      })
    ).subscribe();
  }

  onScroll() {
    const value = this.formGroup.value;
    const val = {
      skip: this.pageSize * this.pageIndex++,
      take: this.pageSize,
      code: value.code,
      name: value.name,
      position: value.position
    };
    this.service.scrollEmployee(val);
    this.assignIsSelect();
  }

  assignIsSelect() {
    this.service.Employees().subscribe(val => {
      this.employees = JSON.parse(JSON.stringify(val));
      this.employees.forEach(e => e.isSelect = this.isSelectAll);
    });
  }

  updateSelect(id: number) {
    const index = this.employeeIds.indexOf(id);
    if (index > -1) {
      this.employeeIds.splice(index, 1);
    } else {
      this.employeeIds.push(id);
    }
    this.isSelectAll = this.employees !== null && this.employees.every(e => e.isSelect);
    this.checkEvent.emit(this.employeeIds);
  }

  someComplete(): boolean {
    if (this.employees == null) {
      return false;
    }
    return (
      this.employees.filter(e => e.isSelect).length > 0 && !this.isSelectAll
    );
  }

  setAll(select: boolean) {
    this.isSelectAll = select;
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


