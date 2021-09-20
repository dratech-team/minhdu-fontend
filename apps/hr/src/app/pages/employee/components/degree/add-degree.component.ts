import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DegreeLevelEnum, DegreeStatusEnum, DegreeTypeEnum } from '@minhdu-fontend/enums';
import { EmployeeAction } from '@minhdu-fontend/employee';


@Component({
  templateUrl: 'add-degree.component.html'
})

export class AddDegreeComponent implements OnInit {
  degreeLevelEnum = DegreeLevelEnum;
  degreeTypeEnum = DegreeTypeEnum;
  degreeStatusEnum = DegreeStatusEnum;
  formGroup!: FormGroup;
  submitted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly dialogRef: MatDialogRef<AddDegreeComponent>
  ) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      type: [this.data?.degree?.type, Validators.required],
      startedAt: [this.data?.degree?.startedAt, Validators.required],
      endedAt: [this.data?.degree?.endedAt, Validators.required],
      school: [this.data?.degree?.school, Validators.required],
      // trainingBy: [this.data?.degree?.trainingBy, Validators.required],
      major: [this.data?.degree?.major, Validators.required],
      formality: [this.data?.degree?.formality, Validators.required],
      level: [this.data?.degree?.level, Validators.required],
      status: [this.data?.degree?.status, Validators.required]
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  onSubmit() {
    console.log(this.formGroup)
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;
    const degree = {
      startedAt: new Date(value.startedAt),
      endedAt: new Date(value.endedAt),
      type: value.type,
      school: value.school,
      major: value.major,
      formality: value.formality,
      level: value.level,
      status: value.status,
      employeeId: this.data?.employeeId
    };
    if (this.data.degree) {
      this.store.dispatch(EmployeeAction.updateDegree(
        { degree: degree, id: this.data.id, employeeId: this.data.employeeId }));
    } else {
      this.store.dispatch(EmployeeAction.addDegree({ degree: degree }));
    }
    this.dialogRef.close()
  }
}
