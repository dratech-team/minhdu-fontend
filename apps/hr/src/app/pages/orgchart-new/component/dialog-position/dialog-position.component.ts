import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  Store } from '@ngrx/store';
import { PositionActions } from '../../../../../../../../libs/orgchart/src/lib/+state/position';

@Component({
  templateUrl:'dialog-position.component.html'
})
export class DialogPositionComponent implements OnInit{
  formGroup!: FormGroup
  submitted = false
  constructor(
    private readonly dialogRef: MatDialogRef<DialogPositionComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) {
  }
  ngOnInit(){
    if(this.data?.isUpdate){
      this.formGroup = this.formBuilder.group({
        name:[this.data.name],
        workday:[this.data.workday],
      })
    }else{
      this.formGroup = this.formBuilder.group({
        name:[undefined,Validators.required],
        workday:[undefined,Validators.required],
      })
    }
  }
  get checkValid() {
    return this.formGroup.controls;
  }
  onsubmit(){
    if(this.formGroup.invalid){
      const val = this.formGroup.value
      this.store.dispatch(PositionActions.addPosition({name:val.name, workday: val.workday }))
    }else {
      return
    }
   this.dialogRef.close()
  }
}
