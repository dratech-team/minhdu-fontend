import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import {
  EmployeeAction,
  selectEmployeeLoaded,
  selectorAllEmployee,
} from '@minhdu-fontend/employee';
import {
  ConvertBoolean,
  FlatSalary,
  Gender,
  SearchEmployeeType,
} from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { debounceTime, tap } from 'rxjs/operators';
import { AppState } from '../../../../reducers';
import { DeleteEmployeeComponent } from '../../components/dialog-delete-employee/delete-employee.component';
import { AddEmployeeComponent } from '../../components/employee/add-employee.component';

@Component({
  templateUrl: 'employee.component.html',
})
export class EmployeeComponent implements OnInit {
  searchType = SearchEmployeeType;
  genderType = Gender;
  flatSalary = FlatSalary;
  convertBoolean = ConvertBoolean;
  contextMenuPosition = { x: '0px', y: '0px' };
  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;
  employees$ = this.store.pipe(select(selectorAllEmployee));
  loaded$ = this.store.pipe(select(selectEmployeeLoaded));
  pageSize: number = 30;
  pageIndexInit = 0;

  formGroup = new FormGroup({
    code: new FormControl(''),
    name: new FormControl(''),
    gender: new FormControl(''),
    position: new FormControl(''),
    branch: new FormControl(''),
    workedAt: new FormControl(''),
    flatSalary: new FormControl(''),
  });

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.store.dispatch(
      EmployeeAction.loadInit({ take: this.pageSize, skip: this.pageIndexInit })
    );
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.store.dispatch(EmployeeAction.loadInit(this.employee(val)));
        })
      )
      .subscribe();
  }

  add(): void {
    this.dialog.open(AddEmployeeComponent, {
      data: { mode: 'CREATE' },
      width: '60%',
    });
  }

  delete($event: any): void {
    const dialogRef = this.dialog.open(DeleteEmployeeComponent, {
      minWidth: '30%',
    });
    dialogRef.afterClosed().subscribe((val) => {
      if (val) {
        this.store.dispatch(EmployeeAction.deleteEmployee({ id: $event.id }));
      }
    });
  }

  employee(val: any) {
    const employee = {
      skip: this.pageIndexInit,
      take: this.pageSize,
      code: val.code,
      name: val.name,
      gender: val.gender,
      position: val.position,
      branch: val.branch,
      workedAt: val.workedAt,
      isFlatSalary:
        val.flatSalary === this.flatSalary.FLAT_SALARY
          ? this.convertBoolean.TRUE
          : val.flatSalary === this.flatSalary.NOT_FLAT_SALARY
          ? this.convertBoolean.FALSE
          : val.flatSalary,
    };
    if (val.workedAt) {
      return employee;
    } else {
      delete employee.workedAt;
      return employee;
    }
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(EmployeeAction.loadMoreEmployees(this.employee(val)));
  }

  readAndUpdate($event: any): void {
    this.router.navigate(['ho-so/chi-tiet-nhan-vien', $event.id]).then();
  }
}
