import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ConvertBoolean} from '@minhdu-fontend/enums';
import {NzModalRef} from "ng-zorro-antd/modal";
import {Actions} from "@datorama/akita-ng-effects";
import {EmployeeActions, EmployeeQuery} from "@minhdu-fontend/employee-v2";
import {
  BaseAddRelativeDto,
  BaseUpdateRelativeDto
} from "../../../../../../../../libs/employee-v2/src/lib/employee/dto/relative";
import {RelationshipConstant} from "../../constants/relationship.constant";
import {ModalRelative} from "../../data/modal-relative.data";


@Component({
  templateUrl: 'modal-relative.component.html'
})
export class ModalRelativeComponent implements OnInit {
  @Input() data!: ModalRelative
  formGroup!: FormGroup;
  submitted = false;
  convertBoolean = ConvertBoolean;
  added$ = this.employeeQuery.select(state => state.added)

  relationshipConstant = RelationshipConstant

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly modalRef: NzModalRef,
    private readonly actions$: Actions,
    private readonly employeeQuery: EmployeeQuery
  ) {
  }

  ngOnInit() {
    const relative = this.data.update?.relative
    this.formGroup = this.formBuilder.group({
      lastName: [relative?.lastName || '', Validators.required],
      issuedBy: [relative?.issuedBy || ''],
      religion: [relative?.religion || ''],
      ethnicity: [relative?.ethnicity],
      birthplace: [relative?.birthplace],
      address: [relative?.address],
      identify: [relative?.identify],
      idCardAt: [relative?.idCardAt],
      phone: [relative?.phone],
      workPhone: [relative?.workPhone],
      birthday: [relative?.birthday, Validators.required],
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
    this.submitted = true
    if (this.formGroup.invalid) {
      return;
    }
    const relative = this.mapRelative();

    this.actions$.dispatch(
      this.data.update?.relative
        ? EmployeeActions.updateRelative({
          id: this.data.update.relative.id,
          updates: relative
        })
        : EmployeeActions.addOneRelative({
          body: relative
        })
    )

    this.added$.subscribe(val => {
      if (val) {
        this.modalRef.close()
      }
    })

  }

  private mapRelative(): BaseAddRelativeDto | BaseUpdateRelativeDto {
    const value = this.formGroup.value
    return {
      employeeId: this.data.employeeId,
      relationship: value.relationship,
      lastName: value.lastName,
      gender: value.gender,
      phone: value.phone?.toString(),
      workPhone: value.workPhone?.toString(),
      birthplace: value.birthplace,
      identify: value.identify?.toString(),
      issuedBy: value.issuedBy,
      wardId: value.ward.id,
      address: value.address,
      birthday: value.birthday,
      idCardAt: value.idCardAt,
      religion: value.religion,
      ethnicity: value.ethnicity,
      sos: value.sos ?
        this.convertBoolean.TRUE :
        this.convertBoolean.FALSE,
      career: value.career,
      note: value.note,
      email: value.email
    }
  }

}
