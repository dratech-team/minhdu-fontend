import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Employee } from '@minhdu-fontend/data-models';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { PickEmployeeService } from './pick-employee.service';
import { document } from 'ngx-bootstrap/utils';

@Component({
  selector: 'app-pick-employee',
  templateUrl: './pick-employee.component.html'
})
export class PickEmployeeComponent implements OnInit, OnChanges {
  @Input() pickOne = false;
  @Input() positionId?: number;
  @Output() checkEvent = new EventEmitter<number[]>();
  @Output() checkEventPickOne = new EventEmitter<number>();
  type = SalaryTypeEnum;
  pageIndex: number = 1;
  pageSize: number = 30;
  pageIndexInit = 0;
  isSelectAll: boolean = false;
  employees: Employee[] = [];
  employeeIds: number[] = [];
  employeeId!: number;
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
        this.pageIndex = 1;
        const search = {
          code: val.code,
          name: val.name,
          branch: val.branch
        };
        this.service.searchEmployees(search);
        this.assignIsSelect();
      })
    ).subscribe();
  }
  ngOnChanges() {
    this.service.onInit({positionId: this?.positionId});
    this.assignIsSelect();
  }

  // onScroll() {
  //   const value = this.formGroup.value;
  //   const val = {
  //     skip: this.pageSize * this.pageIndex,
  //     take: this.pageSize,
  //     code: value.code,
  //     name: value.name,
  //     position: value.position
  //   };
  //   this.pageIndex ++
  //   this.service.scrollEmployee(val);
  //   this.assignIsSelect();
  // }

  assignIsSelect() {
    this.service.Employees().subscribe(val => {
      this.employees = JSON.parse(JSON.stringify(val));
      this.employees.forEach(e =>
      {
        e.isSelect = this.employeeIds.includes(e.id);
      });
      if(this.isSelectAll && this.employeeIds.length >= this.employees.length){
          this.employees.forEach(e => {
            if(!this.employeeIds.includes(e.id))
              this.employeeIds.push(e.id)
          })
      }else {
        this.isSelectAll = false
        this.employees.forEach(e =>
        {
          e.isSelect = this.employeeIds.includes(e.id);
        });
      }
    });
    this.checkEvent.emit(this.employeeIds)
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
          if(!this.employeeIds.includes(employee.id)){
            this.employeeIds.push(employee.id)
          }
        }else {
          const index = this.employeeIds.indexOf(employee.id);
          if (index > -1) {
            this.employeeIds.splice(index, 1);
          }
        }
      }
    );
    this.checkEvent.emit(this.employeeIds);
  }
  pickOneEmployee(){
    const pickEmployee = document.getElementsByName('pick-one');
    for (let i = 0; i < pickEmployee.length; i++) {
      if (pickEmployee[i].checked) {
        this.employeeId = parseInt(pickEmployee[i].value) ;
      }
    }
    this.checkEventPickOne.emit( this.employeeId)
  }
}


