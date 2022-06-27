import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {  StatisticalYType } from '@minhdu-fontend/enums';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';



@Component({
  templateUrl:'pick-statistical-type.component.html',
})
export class PickStatisticalTypeComponent implements OnInit {
  statisticalYType = StatisticalYType;
  formGroup!: UntypedFormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: UntypedFormBuilder,

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
}
