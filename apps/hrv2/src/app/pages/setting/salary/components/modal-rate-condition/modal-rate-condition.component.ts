import {Component, Input, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ConditionConstant} from "../../constants/condition.constant";
import {ModalRateConditionData} from "../../data/modal-rate-condition.data";
import {NzModalRef} from "ng-zorro-antd/modal";
import {RateConditionService} from "../../services/rate-condition.service";
import {RateConditionEntity} from "../../entities/rate-condition.entity";
import {NzMessageService} from "ng-zorro-antd/message";
import {catchError, debounceTime} from "rxjs/operators";
import {throwError} from "rxjs";
import {RateConditionConstant} from "../../constants/rate-condition.constant";
import {RateConditionEnum} from "../../enums/rate-condition.enum";
import * as _ from "lodash";

@Component({
  templateUrl: 'modal-rate-condition.component.html'
})
export class ModalRateConditionComponent implements OnInit {
  @Input() data?: ModalRateConditionData

  conditionConstant = ConditionConstant
  rateConditionConstant = RateConditionConstant
  rateConditionEnum = RateConditionEnum
  submitting = false
  formGroup!: FormGroup
  with?: number

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly modalRef: NzModalRef,
    private readonly service: RateConditionService,
    private readonly message: NzMessageService,
  ) {
  }

  ngOnInit() {
    const rateCondition = this.data?.update?.rateCondition
    this.with = rateCondition?.with
    this.formGroup = this.formBuilder.group({
      condition: [rateCondition?.condition, Validators.required],
      with: [rateCondition?.with, Validators.required],
      default: [rateCondition?.default, Validators.required],
      type: [rateCondition?.type, Validators.required],
      inputWith: [rateCondition?.with]
    })

    this.formGroup.get('inputWith')?.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(val => {
        this.with = val
      })
  }

  onSubmit(): any {
    if (this.formGroup.invalid) {
      return
    }
    this.submitting = true;
    (this.data?.update
        ? this.service.update({id: this.data.update.rateCondition.id, updates: _.omit(this.formGroup.value,['inputWith'])})
        : this.service.addOne({body: _.omit(this.formGroup.value,['inputWith'])})
    ).pipe(
      catchError(err => this.onSubmitErr(err))
    ).subscribe(val => {
      this.onSubmitSuccess(val)
    })
  }

  private onSubmitSuccess(rateCondition: RateConditionEntity) {
    this.submitting = false
    this.message.success(this.data?.update ? 'Cập nhật thành công' : 'Tạo thành công')
    this.modalRef.close(
      this.data?.update ?
        Object.assign(this.data.update.rateCondition , _.omit(this.formGroup.value,['inputWith']))
      : rateCondition)
  }

  private onSubmitErr(err: string) {
    this.submitting = false
    return throwError(err)
  }
}
