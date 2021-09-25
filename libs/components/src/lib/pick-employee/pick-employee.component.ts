import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Employee } from '@minhdu-fontend/data-models';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { PickEmployeeService } from './pick-employee.service';
import { document } from 'ngx-bootstrap/utils';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pick-employee',
  templateUrl: './pick-employee.component.html'
})
export class PickEmployeeComponent implements OnInit {
  @Input() pickOne = false;
  @Input() employees$!: Observable<Employee[]>;
  @Input() searchInit: any;
  @Output() checkEvent = new EventEmitter<number[]>();
  @Output() checkEventPickOne = new EventEmitter<number>();
  type = SalaryTypeEnum;
  isSelectAll = false;
  employees: Employee[] = [];
  employeeIds: number[] = [];
  employeeId!: number;
  formGroup = new FormGroup(
    {
      code: new FormControl(''),
      name: new FormControl('')
    });

  constructor(
    private readonly store: Store,
    private readonly service: PickEmployeeService
  ) {
  }

  ngOnInit(): void {
    this.employees$.subscribe(employee => {
      this.employees = JSON.parse(JSON.stringify(employee));
    });
    this.assignIsSelect();
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((val) => {
        const search = {
          code: val.code,
          name: val.name
        };
        Object.assign(search, this.searchInit);
        this.service.searchEmployees(search);
      })
    ).subscribe();
  }

  assignIsSelect() {
    this.employees.forEach(e => {
      e.isSelect = this.employeeIds.includes(e.id);
    });
    if (this.isSelectAll && this.employeeIds.length >= this.employees.length) {
      this.employees.forEach(e => {
        if (!this.employeeIds.includes(e.id))
          this.employeeIds.push(e.id);
      });
    } else {
      this.isSelectAll = false;
      this.employees.forEach(e => {
        e.isSelect = this.employeeIds.includes(e.id);
      });
    }

    this.checkEvent.emit(this.employeeIds);
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
    this.checkEvent.emit(this.employeeIds);
  }

  pickOneEmployee() {
    const pickEmployee = document.getElementsByName('pick-one');
    for (let i = 0; i < pickEmployee.length; i++) {
      if (pickEmployee[i].checked) {
        this.employeeId = parseInt(pickEmployee[i].value);
      }
    }
    this.checkEventPickOne.emit(this.employeeId);
  }
}


