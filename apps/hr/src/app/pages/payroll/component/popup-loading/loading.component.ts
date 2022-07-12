import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: 'laoding.component.html',
})
export class LoadingComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data?: any) {}
}
