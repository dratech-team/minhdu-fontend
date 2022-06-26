import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { DegreeLevelEnum, DegreeStatusEnum, DegreeTypeEnum } from '@minhdu-fontend/enums';
import { EmployeeAction, selectEmployeeAdded, selectEmployeeAdding } from '@minhdu-fontend/employee';
import { DatePipe } from '@angular/common';


@Component({
  templateUrl: 'add-degree.component.html'
})

export class AddDegreeComponent implements OnInit {
  degreeLevelEnum = DegreeLevelEnum;
  degreeTypeEnum = DegreeTypeEnum;
  degreeStatusEnum = DegreeStatusEnum;
  formGroup!: UntypedFormGroup;
  submitted = false;

  constructor(
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly store: Store,
    private readonly dialogRef: MatDialogRef<AddDegreeComponent>
  ) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      type: [this.data?.degree?.type, Validators.required],
      startedAt: [
        this.datePipe.transform(
          this?.data?.degree?.startedAt, 'yyyy-MM-dd'
        )
        , Validators.required],
      endedAt: [
        this.datePipe.transform(
          this?.data?.degree?.endedAt, 'yyyy-MM-dd'
        )
        , Validators.required],
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
    this.store.pipe(select(selectEmployeeAdded)).subscribe(added => {
      if (added) {
        this.dialogRef.close();
      }
    });
  }
}
