import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { BlockSalariesConstant } from '@minhdu-fontend/constants';
import { TemplateSalaryAction } from '../../+state/teamlate-salary/template-salary.action';
import { selectTemplateAdded } from '../../+state/teamlate-salary/template-salary.selector';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { Branch } from '@minhdu-fontend/data-models';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as lodash from 'lodash';
import { searchAutocomplete } from '@minhdu-fontend/utils';
import { startWith } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  templateUrl: 'template-salary.component.html'
})
export class TemplateSalaryComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g');
  formGroup!: FormGroup;
  submitted = false;
  type = SalaryTypeEnum;
  blockSalary = BlockSalariesConstant;
  branches = new FormControl();
  branches$ = this.store.pipe(select(getAllOrgchart));
  branchesSelected: Branch[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly message: NzMessageService,
    private readonly dialogRef: MatDialogRef<TemplateSalaryComponent>
  ) {
  }

  ngOnInit() {
    this.store.dispatch(OrgchartActions.init());
    if (this.data?.isUpdate) {
      if (this.data.template?.branches) {
        this.branchesSelected = [...this.data.template?.branches];
      }
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
    this.branches$ = searchAutocomplete(
      this.branches.valueChanges.pipe(startWith(this.data?.template?.branch?.name || '')),
      this.branches$
    );
  }

  get f() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    if (this.branches.value) {
      return this.message.error('Đơn vị phải chọn không được nhập');
    }
    const value = this.formGroup.value;
    const template = {
      title: value.title,
      price: typeof (value.price) === 'string' ? Number(value.price.replace(this.numberChars, '')) : value.price,
      type: value.type,
      branchIds: this.branchesSelected.map(val => val.id)
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

  onSelectBranch(event: any, branch: Branch, branchesInput: HTMLInputElement) {
    if (event.isUserInput) {
      if (branch.id) {
        if (this.branchesSelected.some(item => item.id === branch.id)) {
          this.message.success('Đơn vị đã được chọn');
        } else {
          this.branchesSelected.push(branch);
        }
      }
      setTimeout(() => {
        this.branches.setValue('');
        branchesInput.blur();
      });
    }
  }

  removeBranchSelected(branch: Branch) {
    lodash.remove(this.branchesSelected, branch);
  }

}
