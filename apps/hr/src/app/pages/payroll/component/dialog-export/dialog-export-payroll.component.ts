import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Api } from '@minhdu-fontend/constants';
import { ExportService } from '@minhdu-fontend/service';
import { FormControl } from '@angular/forms';

@Component({
  templateUrl: 'dialog-export-payroll.component.html',
})
export class DialogExportPayrollComponent  {
  name = new FormControl('')
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly exportService: ExportService,
    ) {}
  submit(): any {
    const fileName =  this.name.value
    const payroll = {
      code: this.data.code,
      name: this.data.name,
      position: this.data.position,
      branch: this.data.branch,
      paidAt: this.data.paidAt,
      accConfirmedAt: this.data.accConfirmedAt,
    };
    this.exportService.print(
      Api.PAYROLL_EXPORT, Object.assign(payroll,  this.data?.createdAt ? { createdAt: this.data.createdAt } : {})
    );
  }
}
