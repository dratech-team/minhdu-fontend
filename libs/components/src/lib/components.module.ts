import { CommonModule,DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MouseRightComponent } from './mouse-right/mouse-right.component';
import { MatMenuModule } from '@angular/material/menu';
import { ContextMenuModule } from 'ngx-contextmenu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { SearchEmployeePipe } from './pipes/searchEmployee.pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DialogDeleteComponent } from './dialog-delete/dialog-delete.component';
import { NotEmptyPipe } from './pipes/notEmty.pipe';
import { InputCurrencyDirective } from './directive/input-currency.directive';
import { PickEmployeeComponent } from './pick-employee/pick-employee.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    ContextMenuModule.forRoot({ useBootstrap4: true, autoFocus: true }),
    FormsModule,
    MatCheckboxModule,
    MatDialogModule,
    InfiniteScrollModule,
    ReactiveFormsModule
  ],
  declarations: [
    MouseRightComponent,
    SearchEmployeePipe,
    DialogDeleteComponent,
    NotEmptyPipe,
    InputCurrencyDirective,
    PickEmployeeComponent,
  ],
  providers:[
    DecimalPipe
  ],
  exports: [
    MouseRightComponent,
    DialogDeleteComponent,
    NotEmptyPipe,
    SearchEmployeePipe,
    InputCurrencyDirective,
    PickEmployeeComponent,
  ],
})
export class ComponentsModule {}
