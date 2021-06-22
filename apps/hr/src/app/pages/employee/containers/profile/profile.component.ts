import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { selectorAllEmployee } from '../../+state/employee.selector';
import { MatMenuTrigger } from '@angular/material/menu';
import {  EmployeeAction } from '../../+state/employee.action';

import { Router } from '@angular/router';
import { AddEmployeeComponent } from '../../components/employee/add-employee.component';

@Component({
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss'],

})
export class ProfileComponent implements OnInit {
  contextMenuPosition = { x: '0px', y: '0px' };
  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;
  employees$ = this.store.pipe(select(selectorAllEmployee));
  pageIndex: number = 1;
  pageSize: number = 30;

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly router:Router
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(EmployeeAction.loadEmployees({ skip: 0, take: 30 }));
  }

  add(): void {
    this.dialog.open(AddEmployeeComponent,{
      width: '50%',
    } );
  }

  delete(id: number): void {
    this.store.dispatch(EmployeeAction.deleteEmployee({ id: id }));
  }

  onScroll() {

    console.log(this.pageIndex);
    this.store.dispatch(EmployeeAction.loadEmployees({ skip: this.pageSize * this.pageIndex++, take: this.pageSize }));
  }

  readAndUpdate(id: number): void {
    this.router.navigate(['profile/detail-employee', id]).then();
  }
}
