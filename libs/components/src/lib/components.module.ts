import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MouseRightComponent } from './mouse-right/mouse-right.component';
import { MatMenuModule } from '@angular/material/menu';
import { ContextMenuModule } from 'ngx-contextmenu';
import { PickEmployeeComponent } from './pick-employee/pick-employee.component';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { SearchEmployeePipe } from './pipes/searchEmployee.pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DialogDeleteComponent } from './dialog-delete/dialog-delete.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    ContextMenuModule.forRoot({ useBootstrap4: true, autoFocus: true }),
    FormsModule,
    MatCheckboxModule,
    MatDialogModule,
    InfiniteScrollModule
  ],
  declarations: [
    MouseRightComponent,
    PickEmployeeComponent,
    SearchEmployeePipe,
    DialogDeleteComponent,
  ],
  exports: [
    MouseRightComponent,
    PickEmployeeComponent,
    DialogDeleteComponent
  ],
})
export class ComponentsModule {}
