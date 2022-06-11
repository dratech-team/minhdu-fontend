import {Component, Input, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ConditionConstant} from "../../constants/condition.constant";
import {ModalRateConditionData} from "../../data/modal-rate-condition.data";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {RateConditionService} from "../../services/rate-condition.service";
import {RateConditionEntity} from "../../entities/rate-condition.entity";
import {NzMessageService} from "ng-zorro-antd/message";
import {catchError, debounceTime} from "rxjs/operators";
import {throwError} from "rxjs";
import {RateConditionConstant} from "../../constants/rate-condition.constant";
import {RateConditionEnum} from "../../enums/rate-condition.enum";

@Component({
  templateUrl: 'modal-rate-condition.component.html'
})
export class ModalRateConditionComponent implements OnInit {
  @Input() data?: ModalRateConditionData

  conditionConstant = ConditionConstant
  rateConditionConstant = RateConditionConstant
  submitting = false
  alertRateConditionWorkday = 'Nếu nhập số ngày là 0 với loại là theo ngày công chuẩn thì số ngày sẽ bằng ngày công chuẩn'
  alertRateConditionAbsent = 'nếu nhập số ngày là 0 với loại là theo ngày vắng, thì số ngày sẽ bằng ngày trong tháng trừ cho ngày công chuẩn'
  formGroup!: FormGroup

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly modalRef: NzModalRef,
    private readonly modal: NzModalService,
    private readonly service: RateConditionService,
    private readonly message: NzMessageService,
  ) {
  }

  ngOnInit() {
    const rateCondition = this.data?.update?.rateCondition
    this.formGroup = this.formBuilder.group({
      condition: [rateCondition?.condition, Validators.required],
      with: [rateCondition?.with, Validators.required],
      default: [rateCondition?.default, Validators.required],
      type: [rateCondition?.type, Validators.required],
    })

    this.formGroup.get('type')?.valueChanges.subscribe(val => {
      if (this.formGroup.value?.with === 0) {
        val === RateConditionEnum.WORKDAY
          ? this.showAlert(this.alertRateConditionWorkday)
          : this.showAlert(this.alertRateConditionAbsent)
      }
    })

    this.formGroup.get('with')?.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(val => {
        if (val === 0 && this.formGroup.value.type) {
          this.formGroup.value.type === RateConditionEnum.WORKDAY
            ? this.showAlert(this.alertRateConditionWorkday)
            : this.showAlert(this.alertRateConditionAbsent)
        }
      })
  }

  onSubmit(): any {
    if (this.formGroup.invalid) {
      return
    }
    this.submitting = true;
    (this.data?.update
        ? this.service.update({id: this.data.update.rateCondition.id, updates: this.formGroup.value})
        : this.service.addOne({body: this.formGroup.value})
    ).pipe(
      catchError(err => this.onSubmitErr(err))
    ).subscribe(val => {
      this.onSubmitSuccess(val)
    })
  }

  private onSubmitSuccess(rateCondition: RateConditionEntity) {
    this.submitting = false
    this.message.success(this.data?.update ? 'Cập nhật thành công' : 'Tạo thành công')
    this.modalRef.close(rateCondition)
  }

  private onSubmitErr(err: string) {
    this.submitting = false
    return throwError(err)
  }

  private showAlert(message: string) {
    this.modal.info({
      nzContent: message,
    })
  }
}
