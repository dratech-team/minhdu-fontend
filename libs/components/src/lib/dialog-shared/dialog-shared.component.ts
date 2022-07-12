import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: 'dialog-shared.component.html',
})
export class DialogSharedComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  onClick(): boolean {
    return true;
  }
}
