import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './dialog-delete.component.html',
})
export class DialogDeleteComponent  {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  onClick(): boolean {
    return true;
  }
}
