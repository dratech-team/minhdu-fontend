import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: 'dialog-delete.component.html',
  styleUrls: ['dialog-delete.component.scss']
})
export class DialogDeleteComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  onDelete(isDelete: boolean): boolean {
    return isDelete;
  }
}
