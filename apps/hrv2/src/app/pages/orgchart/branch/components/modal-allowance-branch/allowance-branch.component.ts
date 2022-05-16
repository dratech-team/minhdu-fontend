import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzModalRef} from "ng-zorro-antd/modal";
import {Actions} from "@datorama/akita-ng-effects";
import {DataAddOrUpAllowanceBranch} from "../../data/modal-allowance-branch.data";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";
import {BranchActions} from "@minhdu-fontend/orgchart-v2";
import {AllowanceBranchService} from "../../service/allowance-branch.service";

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
    private readonly service: AllowanceBranchService,
    private readonly message: NzMessageService
  ) {
  }

  ngOnInit() {
    const allowance = this.data?.update?.allowance
    this.formGroup = this.formBuilder.group({
      title: [allowance?.title, Validators.required],
      price: [allowance?.price, Validators.required],
      datetime: [allowance?.datetime|| new Date(), Validators.required]
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
      ? this.service.update({id: this.data.update.allowance.id, updates: allowanceBranch})
      : this.service.addOne({body: allowanceBranch})).pipe(catchError(err => {
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
      datetime: value.datetime,
    }
  }
}
