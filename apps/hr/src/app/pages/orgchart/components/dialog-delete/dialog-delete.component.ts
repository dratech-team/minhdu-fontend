import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';

@Component({
  templateUrl: 'dialog-delete.component.html',
  styleUrls: ['dialog-delete.component.scss']
})
export class DialogDeleteComponent implements OnInit {

  formGroupDelete!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
  }

  onDelete(isDelete: boolean): boolean {
    return isDelete;
  }
}
