import {Component, Input, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {ModalDegreeData} from "../../data/modal-degree.data";
import {
  BaseAddDegreeDto,
  BaseUpdateDegreeDto
} from "../../../../../../../../libs/employee-v2/src/lib/employee/dto/degree";
import {NzModalRef} from "ng-zorro-antd/modal";
import {Actions} from "@datorama/akita-ng-effects";
import {EmployeeActions, EmployeeQuery} from "@minhdu-fontend/employee-v2";
import {DegreeTypeConstant} from "../../constants/degree-type.constant";
import {FormalityTypeConstant} from "../../constants/formality-type.constant";
import {DegreeStatusTypeConstant} from "../../constants/degree-status-type.constant";
import {DegreeLevelTypeConstant} from "../../constants/degree-level-type.constant";


@Component({
  templateUrl: 'modal-degree.component.html'
})

export class ModalDegreeComponent implements OnInit {
  @Input() data!: ModalDegreeData

  loading$ = this.employeeQuery.select(state => state.loading)

  degreeTypeConstant = DegreeTypeConstant
  formalityTypeConstant = FormalityTypeConstant
  degreeLevelTypeConstant = DegreeLevelTypeConstant
  degreeStatusTypeConstant = DegreeStatusTypeConstant

  submitted = false;

  formGroup!: UntypedFormGroup;

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly store: Store,
    private readonly modalRef: NzModalRef,
    private readonly actions$: Actions,
    private readonly employeeQuery: EmployeeQuery
  ) {
  }

  ngOnInit() {
    const degree = this.data.update?.degree
    this.formGroup = this.formBuilder.group({
      type: [degree?.type || '', Validators.required],
      startedAt: [degree?.startedAt || '', Validators.required],
      endedAt: [degree?.endedAt || '', Validators.required],
      school: [degree?.school || '', Validators.required],
      // trainingBy: [this.data?.degree?.trainingBy, Validators.required],
      major: [degree?.major || '', Validators.required],
      formality: [degree?.formality || '', Validators.required],
      level: [degree?.level || '', Validators.required],
      status: [degree?.status || '', Validators.required]
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
    const degree = this.mapDegree(this.formGroup.value);
    this.actions$.dispatch(
      this.data.update?.degree
        ? EmployeeActions.updateDegree(
          {
            id: this.data.update.degree.id,
            updates: degree
          }
        )
        : EmployeeActions.addOneDegree({
          body: degree
        })
    )

    this.loading$.subscribe(val => {
      if (val === false) {
        this.modalRef.close()
      }
    })
  }

  private mapDegree(value: any): BaseAddDegreeDto | BaseUpdateDegreeDto {
    return {
      note: value.note,
      startedAt: new Date(value.startedAt),
      endedAt: new Date(value.endedAt),
      type: value.type,
      school: value.school,
      major: value.major,
      formality: value.formality,
      level: value.level,
      status: value.status,
      employeeId: this.data.employeeId
    }
  }
}
