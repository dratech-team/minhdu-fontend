import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FilterTypeEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { TypePayrollExportConstant } from '@minhdu-fontend/constants';

@Component({
  templateUrl: 'select-update-multiple.html',
})
export class SelectUpdateMultiple {
  typePayroll = FilterTypeEnum;
  typePayrollExportConstant = TypePayrollExportConstant;
  constructor(
    private readonly dialogRef: MatDialogRef<SelectUpdateMultiple>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  selectTypeUpdateMultiple(payrollType: FilterTypeEnum): any {
    this.dialogRef.close(payrollType);
  }
}
