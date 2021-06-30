import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AddEmployeeComponent } from '../../components/employee/add-employee.component';
import { DeleteEmployeeComponent } from '../../components/dialog-delete-employee/delete-employee.component';
import { EmployeeAction, selectorAllEmployee } from '@minhdu-fontend/employee';


@Component({
  templateUrl: 'employee.component.html',
  styleUrls: ['employee.component.scss']

})
export class EmployeeComponent implements OnInit {
  contextMenuPosition = { x: '0px', y: '0px' };
  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;
  employees$ = this.store.pipe(select(selectorAllEmployee));
  pageIndex: number = 1;
  pageSize: number = 30;

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(EmployeeAction.loadEmployees({RequestPaginate:{ skip: 0, take: 30 }, isSelect: false}));
  }

  add(): void {
    this.dialog.open(AddEmployeeComponent, {
      width: '50%'
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

  onScroll() {
    this.store.dispatch(EmployeeAction.loadEmployees({RequestPaginate: { skip: this.pageSize * this.pageIndex++, take: this.pageSize }, isSelect: false}));
  }

  readAndUpdate($event: any): void {
    this.router.navigate(['profile/detail-employee', $event.id]).then();
  }
}
