import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { ReactiveFormsModule } from '@angular/forms';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { TableSelectPayrollComponent } from './components/table-select-payroll/table-select-payroll.component';

@NgModule({
  declarations: [TableSelectPayrollComponent],
  imports: [
    CommonModule,
    NzTableModule,
    NzCollapseModule,
    ReactiveFormsModule,
    NzDropDownModule,
    NzIconModule,
    NzStepsModule,
    NzSelectModule,
    NzModalModule,
    NzMessageModule,
    NzButtonModule,
  ],
  exports: [TableSelectPayrollComponent],
})
export class SharedModule {}
