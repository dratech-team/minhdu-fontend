import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Api } from '@minhdu-fontend/constants';
import { ExportService } from '@minhdu-fontend/service';
import { FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FilterTypeEnum } from '@minhdu-fontend/enums';

@Component({
  templateUrl: 'dialog-export-timekeeping.component.html'
})
export class DialogExportTimekeepingComponent {
  name = new FormControl('', Validators.required);
  submitted = false
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly exportService: ExportService,
    private readonly datePipe: DatePipe,
    private readonly dialogRef: MatDialogRef<DialogExportTimekeepingComponent>
  ) {
  }

  onSubmit(): any {
    this.submitted = true
    if(!this.name.value){
      return
    }
    const datetime = this.datePipe.transform(this.data.datetime, 'yyyy-MM');
    this.exportService.print(
      Api.HR.PAYROLL.EXPORT,
      {
        datetime: datetime ? new Date(datetime) : new Date(),
        filename: this.name.value,
        exportType: FilterTypeEnum.TIME_SHEET
      },

    );
    this.dialogRef.close();
  }
}
