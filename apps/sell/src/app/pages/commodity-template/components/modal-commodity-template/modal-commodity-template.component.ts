import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Actions } from '@datorama/akita-ng-effects';
import { PositionQuery } from '@minhdu-fontend/orgchart-v2';
import { DataModalCommodityTemplateData } from '../../data/data-modal-commodity-template.data';
import { CommodityTemplateQuery } from '../../state/commodity-template.query';
import { CommodityTemplateActions } from '../../state/commodity-template.action';

@Component({
  templateUrl: 'modal-commodity-template.component.html'
})
export class ModalCommodityTemplateComponent implements OnInit {
  @Input() data?: DataModalCommodityTemplateData;

  loading$ = this.query.selectLoading();

  formGroup!: FormGroup;

  constructor(
    private readonly modalRef: NzModalRef,
    private readonly actions$: Actions,
    private readonly formBuilder: FormBuilder,
    private readonly positionQuery: PositionQuery,
    private readonly query: CommodityTemplateQuery
  ) {
  }

  ngOnInit() {
    const template = this.data?.update?.template;
    this.formGroup = new FormGroup({
      name: new FormControl<string>(template?.name || '', { validators: Validators.required }),
      code: new FormControl<string>(template?.code || '', { validators: Validators.required })
    });
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onsubmit(): any {
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;
    const template = {
      name: value.name,
      code: value.code
    };

    this.actions$.dispatch(
      this.data?.update
        ? CommodityTemplateActions.update({
          id: this.data.update.template.id,
          updates: template
        })
        : CommodityTemplateActions.addOne({ body: template })
    );
    this.query.select().subscribe((state) => {
      if (!(state.loading && state.error)) {
        this.modalRef.close();
      }
    });
  }
}
