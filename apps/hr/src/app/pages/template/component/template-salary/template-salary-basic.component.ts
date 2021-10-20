import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { OrgchartActions } from '@minhdu-fontend/orgchart';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { PositionActions } from 'libs/orgchart/src/lib/+state/position';
import { BlockSalaryConstant } from '@minhdu-fontend/constants';
import { TemplateSalaryAction } from '../../+state/teamlate-salary/template-salary.action';
import { selectTemplateLoaded } from '../../+state/template-overtime/template-overtime.selector';


@Component({
  templateUrl: 'template-salary-basic.component.html'
})
export class TemplateSalaryBasicComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g');
  formGroup!: FormGroup;
  submitted = false;
  type = SalaryTypeEnum;
  blockSalary = BlockSalaryConstant;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly dialogRef: MatDialogRef<TemplateSalaryBasicComponent>
  ) {
  }

//TODO
  ngOnInit() {
    this.store.dispatch(PositionActions.loadPosition());
    this.store.dispatch(OrgchartActions.init());
    this.formGroup = this.formBuilder.group({
      type: [this.data?.price, Validators.required],
      price: [this.data?.price],
      title: [this.data?.title]
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;
    const template = {
      title: value.title,
      price: typeof (value.price) === 'string' ? Number(value.price.replace(this.numberChars, '')) : value.price,
      type: this.type.BASIC
    };
    if (this.data) {
      this.store.dispatch(TemplateSalaryAction.updateTemplate(
        {
          id: this.data.id,
          template: template
        }));
    } else {
      this.store.dispatch(TemplateSalaryAction.AddTemplate(
        { template: template }));
    }
    this.store.pipe(select(selectTemplateLoaded)).subscribe(added => {
      if (added) {
        this.dialogRef.close(template);
      }
    });
  }
}
