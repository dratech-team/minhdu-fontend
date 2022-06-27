import {Component, Input, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {Actions} from '@datorama/akita-ng-effects';
import {ConsignmentEntity} from "../../entities";
import {NzModalRef} from "ng-zorro-antd/modal";
import {BaseAddConsignmentDto} from "../../dto";
import {ConsignmentQuery} from "../../state/consignment.query";
import {ConsignmentActions} from "../../state/consignment.actions";

@Component({
  templateUrl: 'consignment-dialog.component.html'
})
export class ConsignmentDialogComponent implements OnInit {
  @Input() data?: { consignment?: ConsignmentEntity, isUpdate?: boolean }
  loading$ = this.consignmentQuery.select(state => state.loading)
  formGroup!: UntypedFormGroup
  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    public datePipe: DatePipe,
    private readonly consignmentQuery: ConsignmentQuery,
    private readonly action$: Actions,
    private readonly modelRef: NzModalRef,
  ) {
  }

  ngOnInit() {
    if (this.data?.consignment) {
      this.formGroup = this.formBuilder.group({
        code: [this.data.consignment?.code, Validators.required],
        exp: [this.datePipe.transform(this.data.consignment.exp ,'yyyy-MM-dd'), Validators.required],
        mfg: [this.datePipe.transform(this.data.consignment.mfg, 'yyyy-MM-dd'),Validators.required],
        amount: ['',Validators.required],
      });
    } else {
      this.formGroup = this.formBuilder.group({
        code: ['', Validators.required],
        exp: ['', Validators.required],
        mfg: ['',Validators.required],
        amount: ['',Validators.required],
      });
    }
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value
    const consignment : BaseAddConsignmentDto = {
      code: value.barcode,
      exp: value.exp,
      mfg: value.mfg,
      amount: value?.amount
    }
    if (this.data?.isUpdate && this.data.consignment) {
      this.action$.dispatch(ConsignmentActions.update({id: this.data.consignment.id, updates: consignment}));
    } else {
      this.action$.dispatch(ConsignmentActions.addOne({body: consignment}));
    }
    this.loading$.subscribe(loading => {
      if (loading === false) {
        this.modelRef.close()
      }
    })
  }
}


