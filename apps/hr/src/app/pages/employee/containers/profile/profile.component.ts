import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { selectorAllEmployee } from '../../+state/employee/employee.selector';
import { MatMenuTrigger } from '@angular/material/menu';
import {  EmployeeAction } from '../../+state/employee/employee.action';
import { AddEmployeeComponent } from '../../components/add-employee/add-employee.component';
import { Employee } from '../../+state/employee/employee.interface';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss']
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

  onContextMenu(event: MouseEvent, item: Employee) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  add(): void {
    this.dialog.open(AddEmployeeComponent );
  }

  delete(id: number): void {
    this.store.dispatch(EmployeeAction.deleteEmployee({ id: id }));
  }

  onScroll() {

    console.log(this.pageIndex);
    this.store.dispatch(EmployeeAction.loadEmployees({ skip: this.pageSize * this.pageIndex++, take: this.pageSize }));
  }

  readAndUpdate(id: number): void {
    console.log(id)
    this.router.navigate(['profile/detail-employee', id]).then();
  }
}
