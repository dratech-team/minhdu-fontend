import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { PayrollService } from '../../service/payroll.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  templateUrl: 'restore-payroll.component.html'
})
export class RestorePayrollComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly store: Store,
    private readonly payrollService: PayrollService,
    private readonly message: NzMessageService,
    private readonly dialogRef: MatDialogRef<RestorePayrollComponent>
  ) {
  }

  restorePayroll() {
    this.payrollService.restorePayroll(this.data.payroll.id).subscribe(
      res => {
        this.message.success(res.message);
      }
    );
    this.dialogRef.close();
  }
}
