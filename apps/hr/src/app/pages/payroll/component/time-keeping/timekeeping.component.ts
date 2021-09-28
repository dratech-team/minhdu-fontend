import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Employee } from '@minhdu-fontend/data-models';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { TimekeepingService } from './timekeeping.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ChecklistService } from '../../service/checklist.service';
@Component({
  templateUrl: './timekeeping.component.html'
})
export class TimekeepingComponent implements OnInit, AfterViewInit {
  @ViewChild('inputTimekeeping') inputTimekeeping!: ElementRef
  type = SalaryTypeEnum;
  isSelectAll = false;
  employees: Employee[] = [];
  employeeIds: number[] = [];
  employeeId!: number;
  formSearch = new FormGroup(
    {
      code: new FormControl(''),
      name: new FormControl(''),
      position: new FormControl('')
    });

  constructor(
    private readonly store: Store,
    public datePipe: DatePipe,
    private readonly service: TimekeepingService,
    private readonly checkListService: ChecklistService,
    @Inject(MAT_DIALOG_DATA) public data: Observable<Employee[]>
  ) {
  }

  ngOnInit(): void {
    this.data.subscribe(employee => {
      this.employees = JSON.parse(JSON.stringify(employee));
    });
    this.assignIsSelect();
    this.formSearch.valueChanges.pipe(
      debounceTime(1000),
      tap((val) => {
        const search = {
          code: val.code,
          name: val.name,
          position: val.position
        };
        this.service.searchEmployees(search);
      })
    ).subscribe();
  }
  ngAfterViewInit() {
    this.inputTimekeeping.nativeElement.value =  this.datePipe.transform( new Date(), 'yyyy-MM-dd')
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
  }

  updateSelect(id: number) {
    const index = this.employeeIds.indexOf(id);
    if (index > -1) {
      this.employeeIds.splice(index, 1);
    } else {
      this.employeeIds.push(id);
    }
    this.isSelectAll = this.employees !== null && this.employees.every(e => e.isSelect);
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
  }
  onSubmit(){
    const checkList = {
      employeeIds: this.employeeIds,
      createdAt: this.inputTimekeeping.nativeElement.value
    }
    console.log(checkList)
    this.checkListService.timekeeping(checkList)
  }
}


