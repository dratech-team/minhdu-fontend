import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';



@Component({
  templateUrl:'pick-day-to-day.component.html',
})
export class PickDayToDayComponent implements OnInit {
  formGroup!: UntypedFormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: UntypedFormBuilder,

  ) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      startedAt: [Validators.required],
      endedAt: [Validators.required]
    })
  }

  onSubmit() {
    const val = this.formGroup.value
    return  {
      startedAt: new Date(val.startedAt) ,
      endedAt: new Date(val.endedAt) ,
    }
  }
}
