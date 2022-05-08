import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatetimeUnitEnum, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {NzModalRef} from "ng-zorro-antd/modal";
import {Actions} from "@datorama/akita-ng-effects";
import {AllowanceSalaryService} from "../../../../salary/service";
import {DataAddOrUpAllowanceBranch} from "../../data/modal-allowance-branch.data";
import {getFirstDayInMonth, getLastDayInMonth} from "@minhdu-fontend/utils";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";
import {BranchActions} from "@minhdu-fontend/orgchart-v2";

@Component({
  templateUrl: 'allowance-branch.component.html'
})
export class AllowanceBranchComponent implements OnInit {
  @Input() data!: DataAddOrUpAllowanceBranch
  formGroup!: FormGroup;
  summiting = false;

  constructor(
    private readonly modalRef: NzModalRef,
    private readonly formBuilder: FormBuilder,
    private readonly actions$: Actions,
    private readonly allowanceService: AllowanceSalaryService,
    private readonly message: NzMessageService
  ) {
  }

  ngOnInit() {
    const allowance = this.data?.update?.allowance
    this.formGroup = this.formBuilder.group({
      title: [allowance?.title, Validators.required],
      price: [allowance?.price, Validators.required],
      datetime: [this.data?.update ?
        getFirstDayInMonth(new Date(this.data.update.allowance.startedAt))
        : new Date(), Validators.required]
    });
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onsubmit(): any {
    if (this.formGroup.invalid) {
      return
    }
    const val = this.formGroup.value;
    const allowanceBranch = this.mapAllowance(val);
    this.summiting = true;

    (this.data?.update
      ? this.allowanceService.update(this.data.update.allowance.id, allowanceBranch)
      : this.allowanceService.addOne(allowanceBranch)).pipe(catchError(err => {
      this.summiting = false
      return throwError(err)
    })).subscribe(_ => {
      this.message.success('Thêm phụ cấp thành công')
      const branchId = this.data.add?.branch.id || this.data.update?.allowance.branch?.id
      if (branchId) {
        this.actions$.dispatch(BranchActions.loadOne(
          {id: branchId}
        ))
      }
      this.modalRef.close()
    })
  }

  mapAllowance(value: any) {
    return {
      branchId: this.data.add?.branch.id || this.data.update?.allowance.branch?.id,
      title: value.title,
      price: value.price,
      startedAt: getFirstDayInMonth(new Date(value.datetime)),
      endedAt: getLastDayInMonth(new Date(value.datetime)),
      unit: DatetimeUnitEnum.MONTH,
      type: SalaryTypeEnum.ALLOWANCE
    }
  }
}
