import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: 'show-alert.component.html',
})
export class ShowAlertComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }
}
