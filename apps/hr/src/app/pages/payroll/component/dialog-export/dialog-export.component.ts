import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Api } from '@minhdu-fontend/constants';
import { ExportService } from '@minhdu-fontend/service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  templateUrl: 'dialog-export.component.html'
})
export class DialogExportComponent {
  name = new FormControl('', Validators.required);
  submitted = false;

  constructor(
    private readonly dialogRef: MatDialogRef<DialogExportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  onSubmit(): any {
    this.submitted = true;
    if (!this.name.value) {
      return;
    }
    const fileName = this.name.value;
    this.dialogRef.close(fileName)
  }
}
