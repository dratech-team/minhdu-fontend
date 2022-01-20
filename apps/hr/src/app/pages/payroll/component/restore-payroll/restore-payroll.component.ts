import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PayrollService } from '../../service/payroll.service';

@Component({
  templateUrl: 'restore-payroll.component.html'
})
export class RestorePayrollComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly store: Store,
    private readonly payrollService: PayrollService,
    private readonly snackbar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<RestorePayrollComponent>
  ) {
  }

  restorePayroll() {
    this.payrollService.restorePayroll(this.data.payroll.id).subscribe(
      res => {
        this.snackbar.open(res.message, '', { duration: 1500 });
      }
    );
    this.dialogRef.close();
  }
}
