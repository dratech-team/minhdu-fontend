import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: 'laoding.component.html'
})
export class LoadingComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }
}
