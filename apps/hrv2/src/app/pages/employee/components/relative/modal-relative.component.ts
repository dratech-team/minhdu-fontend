import { Component, Input, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ConvertBoolean } from '@minhdu-fontend/enums';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Actions } from '@datorama/akita-ng-effects';
import { EmployeeActions, EmployeeQuery } from '@minhdu-fontend/employee-v2';
import {
  BaseAddRelativeDto,
  BaseUpdateRelativeDto,
} from '../../../../../../../../libs/employee-v2/src/lib/employee/dto/relative';
import { RelationshipConstant } from '../../constants/relationship.constant';
import { ModalRelative } from '../../data/modal-relative.data';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: 'modal-relative.component.html',
})
export class ModalRelativeComponent implements OnInit {
  @Input() data!: ModalRelative;
  loading$ = this.employeeQuery.select((state) => state.loading);

  relationshipConstant = RelationshipConstant;

  submitted = false;
  convertBoolean = ConvertBoolean;

  formGroup!: UntypedFormGroup;

  constructor(
    private readonly datePipe: DatePipe,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly modalRef: NzModalRef,
    private readonly actions$: Actions,
    private readonly employeeQuery: EmployeeQuery
  ) {}

  ngOnInit() {
    const relative = this.data.update?.relative;
    this.formGroup = this.formBuilder.group({
      lastName: [relative?.lastName || '', Validators.required],
      issuedBy: [relative?.issuedBy || ''],
      religion: [relative?.religion || ''],
      ethnicity: [relative?.ethnicity],
      birthplace: [relative?.birthplace],
      address: [relative?.address],
      identify: [relative?.identify],
      idCardAt: [
        relative?.idCardAt
          ? this.datePipe.transform(relative.idCardAt, 'yyyy-MM-dd')
          : '',
      ],
      phone: [relative?.phone],
      workPhone: [relative?.workPhone],
      birthday: [
        relative?.birthday
          ? this.datePipe.transform(relative.birthday, 'yyyy-MM-dd')
          : '',
        Validators.required,
      ],
      gender: [relative?.gender, Validators.required],
      note: [relative?.note],
      relationship: [relative?.relationship, Validators.required],
      career: [relative?.career],
      sos: [relative?.sos],
      province: [relative?.ward?.district?.province, Validators.required],
      district: [relative?.ward?.district, Validators.required],
      ward: [relative?.ward, Validators.required],
    });
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const relative = this.mapRelative(this.formGroup.value);

    this.actions$.dispatch(
      this.data.update?.relative
        ? EmployeeActions.updateRelative({
            id: this.data.update.relative.id,
            updates: relative,
          })
        : EmployeeActions.addOneRelative({
            body: relative,
          })
    );

    this.loading$.subscribe((loading) => {
      if (loading == false) {
        this.modalRef.close();
      }
    });
  }

  private mapRelative(value: any): BaseAddRelativeDto | BaseUpdateRelativeDto {
    return {
      employeeId: this.data.employeeId,
      relationship: value.relationship,
      lastName: value.lastName,
      gender: value.gender,
      phone: value.phone,
      workPhone: value.workPhone,
      birthplace: value.birthplace,
      identify: value.identify,
      issuedBy: value.issuedBy,
      wardId: value.ward.id,
      address: value.address,
      birthday: value.birthday,
      idCardAt: value.idCardAt,
      religion: value.religion,
      ethnicity: value.ethnicity,
      sos: value.sos ? this.convertBoolean.TRUE : this.convertBoolean.FALSE,
      career: value.career,
      note: value.note,
      email: value.email,
    };
  }
}
