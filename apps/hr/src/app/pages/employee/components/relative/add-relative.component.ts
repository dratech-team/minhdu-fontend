import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { DatePipe } from '@angular/common';
import {
  EmployeeAction,
  selectEmployeeAdded,
  selectEmployeeAdding,
} from '@minhdu-fontend/employee';
import { ConvertBoolean } from '@minhdu-fontend/enums';

@Component({
  templateUrl: 'add-relative.component.html',
})
export class AddRelativeComponent implements OnInit {
  formGroup!: UntypedFormGroup;
  submitted = false;
  convertBoolean = ConvertBoolean;
  wardId!: number;
  constructor(
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly store: Store,
    private readonly dialogRef: MatDialogRef<AddRelativeComponent>
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      lastName: [this.data?.relative?.lastName, Validators.required],
      issuedBy: [this.data?.relative?.issuedBy],
      religion: [this.data?.relative?.religion],
      ethnicity: [this.data?.relative?.ethnicity],
      birthplace: [this.data?.relative?.birthplace],
      address: [this.data?.relative?.address, Validators.required],
      identify: [this.data?.relative?.identify],
      idCardAt: [
        this.datePipe.transform(this?.data?.relative?.idCardAt, 'yyyy-MM-dd'),
      ],
      phone: [this.data?.relative?.phone],
      workPhone: [this.data?.relative?.workPhone],
      birthday: [
        this.datePipe.transform(this.data?.relative?.birthday, 'yyyy-MM-dd'),
        Validators.required,
      ],
      gender: [this.data?.relative?.gender, Validators.required],
      note: [this.data?.relative?.note],
      relationship: [this.data?.relative?.relationship, Validators.required],
      career: [this.data?.relative?.career],
      sos: [this.data?.relative?.sos],
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
    const relative = {
      relationship: value.relationship,
      lastName: value.lastName,
      gender: value.gender,
      phone: value.phone?.toString(),
      workPhone: value.workPhone?.toString(),
      birthplace: value.birthplace,
      identify: value.identify?.toString(),
      issuedBy: value.issuedBy,
      wardId: this.wardId,
      address: value.address,
      employeeId: this?.data?.employeeId,
      birthday: value.birthday ? value.birthday : undefined,
      idCardAt: value.idCardAt ? value.idCardAt : undefined,
      religion: value.religion ? value.religion : undefined,
      ethnicity: value.ethnicity ? value.ethnicity : undefined,
      sos: value.sos ? this.convertBoolean.TRUE : this.convertBoolean.FALSE,
      career: value.career ? value.career : undefined,
    };
    if (this.data.relative) {
      this.store.dispatch(
        EmployeeAction.updateRelative({
          relative: relative,
          id: this.data.id,
          employeeId: this.data.employeeId,
        })
      );
    } else {
      this.store.dispatch(EmployeeAction.addRelative({ relative: relative }));
    }
    this.store.pipe(select(selectEmployeeAdded)).subscribe((added) => {
      if (added) {
        this.dialogRef.close();
      }
    });
  }

  onSelectWard(wardId: number) {
    this.wardId = wardId;
  }
}
