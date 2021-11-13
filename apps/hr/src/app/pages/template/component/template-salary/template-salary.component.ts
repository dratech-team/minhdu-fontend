import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { BlockSalariesConstant } from '@minhdu-fontend/constants';
import { TemplateSalaryAction } from '../../+state/teamlate-salary/template-salary.action';
import { selectTemplateAdded, selectTemplateLoaded } from '../../+state/teamlate-salary/template-salary.selector';


@Component({
  templateUrl: 'template-salary.component.html'
})
export class TemplateSalaryComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g');
  formGroup!: FormGroup;
  submitted = false;
  type = SalaryTypeEnum;
  blockSalary = BlockSalariesConstant;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly dialogRef: MatDialogRef<TemplateSalaryComponent>
  ) {
  }

  ngOnInit() {
    if (this.data?.isUpdate) {
      this.formGroup = this.formBuilder.group({
        type: [this.data.template.type, Validators.required],
        price: [this.data.template.price],
        title: [this.data.template.title]
      });
    } else {
      this.formGroup = this.formBuilder.group({
        type: [SalaryTypeEnum.BASIC, Validators.required],
        price: [],
        title: ['Lương cơ bản trích BH']
      });
    }
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
      type: value.type
    };
    if (this.data) {
      this.store.dispatch(TemplateSalaryAction.updateTemplate(
        {
          id: this.data.template.id,
          template: template
        }));
    } else {
      this.store.dispatch(TemplateSalaryAction.AddTemplate(
        { template: template }));
    }
    this.store.pipe(select(selectTemplateAdded)).subscribe(added => {
      if (added) {
        this.dialogRef.close(template);
      }
    });
  }
}
