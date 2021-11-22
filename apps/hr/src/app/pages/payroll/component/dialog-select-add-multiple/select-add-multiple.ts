import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';

@Component({
  templateUrl: 'select-add-multiple.html'
})
export class SelectAddMultiple {
  salaryType = SalaryTypeEnum;

  constructor(
    private readonly dialogRef: MatDialogRef<SelectAddMultiple>
  ) {
  }

  selectTypeAddMultiple(salaryType: SalaryTypeEnum): any {
    this.dialogRef.close(salaryType);
  }
}
