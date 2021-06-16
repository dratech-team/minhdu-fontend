import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { selectorAllEmployee } from '../../+state/employee.selector';
import { loadEmployees } from '../../+state/employee.action';
import { MatMenuTrigger } from '@angular/material/menu';
import { Employee } from '../../models/employee.model';
import { deleteEmployee } from '../../+state/employee.action';
import { AddEmployeeComponent } from '../../components/add-employee/add-employee.component';

@Component({
  templateUrl: 'profile.component.html',
  styleUrls:['profile.component.scss']
})
export class ProfileComponent implements OnInit {
  contextMenuPosition = { x: '0px', y: '0px' };
  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;
  employees$ = this.store.pipe(select(selectorAllEmployee));
  pageIndex: number = 1;
  pagSize: number = 30;

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(loadEmployees({  skip: 0,take: 30}))
  }

  onContextMenu(event: MouseEvent, item: Employee) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  addAndUpdate(item?: Employee, isUpdate?: boolean): void {
    console.log(isUpdate);
    this.dialog.open(AddEmployeeComponent, {
      data: { employee: item, isUpdate: isUpdate }
    })
  }

  delete(id: number): void {
    this.store.dispatch(deleteEmployee({ id: id }))
  }

  onScroll() {

    console.log(this.pageIndex);
    this.store.dispatch(loadEmployees({ skip: this.pagSize* this.pageIndex++ ,take: this.pagSize, }))
  }
}
