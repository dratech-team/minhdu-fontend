import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { selectorAllEmployee } from '../../selectors/employee.selector';
import { loadEmployees } from '../../actions/employee.action';
import { MatMenuTrigger } from '@angular/material/menu';
import { Employee } from '../../models/employee.model';
import { deleteEmployee } from '../../actions/employee.action';
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
constructor(
  private readonly dialog: MatDialog,
  private readonly store: Store<AppState>
) {
}

  ngOnInit(): void {
  this.store.dispatch(loadEmployees())
  }
  onContextMenu(event: MouseEvent, item: Employee) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = {'item': item};
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  addAndUpdate(item?: Employee, isUpdate?: boolean): void {
    this.dialog.open(AddEmployeeComponent,{
      data:{employee: item, isUpdate: isUpdate}
    })
  }

  delete(item: Employee): void {
    this.store.dispatch(deleteEmployee({ id: item.id}))
  }
}
