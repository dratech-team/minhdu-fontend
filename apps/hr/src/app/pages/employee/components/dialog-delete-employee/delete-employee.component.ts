import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: 'delete-employee.component.html'
})
export class DeleteEmployeeComponent implements OnInit {
  leftAt: Date | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DeleteEmployeeComponent>
  ) {
  }

  ngOnInit(): void {
  }

  submit(): void {
    this.dialogRef.close({
      leftAt: this.leftAt ? this.leftAt : undefined
    });
  }
}
