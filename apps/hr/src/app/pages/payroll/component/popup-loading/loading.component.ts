import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: 'laoding.component.html'
})
export class LoadingComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LoadingComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  ngOnInit() {
    this.data.loaded.subscribe((loaded: boolean) => {
      if (loaded) {
        this.dialogRef.close();
      }
    });
  }
}
