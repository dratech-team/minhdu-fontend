import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AddEmployeeComponent } from '../../components/employee/add-employee.component';
import { DeleteEmployeeComponent } from '../../components/dialog-delete-employee/delete-employee.component';
import { Gender, SearchEmployeeType } from '@minhdu-fontend/enums';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { EmployeeAction, selectorAllEmployee } from '@minhdu-fontend/employee';

@Component({
  templateUrl: 'employee.component.html'
})
export class EmployeeComponent implements OnInit {
  searchType = SearchEmployeeType;
  genderType = Gender;
  contextMenuPosition = { x: '0px', y: '0px' };
  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;
  employees$ = this.store.pipe(select(selectorAllEmployee));
  pageIndex: number = 1;
  pageSize: number = 30;

  formGroup = new FormGroup(
    {
      code: new FormControl(''),
      name: new FormControl(''),
      gender: new FormControl(''),
      position: new FormControl(''),
      department: new FormControl(''),
      branch: new FormControl(''),
      workedAt: new FormControl('')
    }
  );

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(EmployeeAction.loadInit({ skip: 0, take: 30 }));
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((val) => {
        this.store.dispatch(EmployeeAction.loadInit(this.employee(val, 30, 0)));
      })
    ).subscribe();
  }

  add(): void {
    this.dialog.open(AddEmployeeComponent, {
      width: '60%'
    });
  }

  delete($event: any): void {
    const dialogRef = this.dialog.open(DeleteEmployeeComponent, {
      minWidth: '30%'
    });
    dialogRef.afterClosed().subscribe((val) => {
      if (val) {
        this.store.dispatch(EmployeeAction.deleteEmployee({ id: $event.id }));
      }
    });
  }

  employee(val: any, pageSize: number, pageIndex: number) {
    if (val.workedAt) {
      return {
        skip: pageSize * pageIndex++,
        take: this.pageSize,
        code: val.code,
        name: val.name,
        gender: val.gender,
        position: val.position,
        department: val.department,
        branch: val.branch,
        workedAt: val.workedAt.toString()
      };
    } else {
      return {
        skip: pageSize * pageIndex++,
        take: this.pageSize,
        code: val.code,
        name: val.name,
        gender: val.gender,
        position: val.position,
        department: val.department,
        branch: val.branch
      };
    }
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(EmployeeAction.loadMoreEmployees(this.employee(val, this.pageSize, this.pageIndex)));
  }

  readAndUpdate($event: any): void {
    this.router.navigate(['profile/detail-employee', $event.id]).then();
  }
}
