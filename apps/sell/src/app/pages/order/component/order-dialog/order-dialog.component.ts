import { Component, Inject, OnInit } from '@angular/core';
import { AppState } from '../../../../reducers';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  templateUrl: 'order-dialog.component.html',
})
export class OrderDialogComponent implements OnInit {
  formGroup!: FormGroup;
  constructor(
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }
  ngOnInit() {
    this.formGroup = this.formBuilder.group({
    })
  }
  onSubmit(){

  }
}
