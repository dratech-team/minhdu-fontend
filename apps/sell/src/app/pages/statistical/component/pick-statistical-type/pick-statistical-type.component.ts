import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  StatisticalYType } from '@minhdu-fontend/enums';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DevelopmentComponent } from 'libs/components/src/lib/development/development.component';


@Component({
  templateUrl:'pick-statistical-type.component.html',
})
export class PickStatisticalTypeComponent implements OnInit {
  statisticalYType = StatisticalYType;
  formGroup!: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private readonly dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      type: [Validators.required],
      startedAt: [Validators.required],
      endedAt: [Validators.required]
    })
  }

  onSubmit() {
    const val = this.formGroup.value
    return  {
      startedAt: val.startedAt,
      endedAt: val.endedAt,
      type: val.type
    }
  }

  print() {
    const val = this.formGroup.value
    return  {
      startedAt: val.startedAt,
      endedAt: val.endedAt,
      type: val.type,
      print: true
    }
  }
}
