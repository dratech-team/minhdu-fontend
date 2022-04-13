import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {SalaryTypeEnum} from '@minhdu-fontend/enums';
import {TemplateSalaryAction} from '../../+state/teamlate-salary/template-salary.action';
import {selectTemplateAdded} from '../../+state/teamlate-salary/template-salary.selector';
import {getAllOrgchart, OrgchartActions} from '@minhdu-fontend/orgchart';
import {Branch} from '@minhdu-fontend/data-models';
import * as lodash from 'lodash';
import {NzMessageService} from 'ng-zorro-antd/message';
import {salaryReference} from "../../enums";
import {blockSalariesConstant} from "../../constants";
import {SalarySetting} from "../../+state/teamlate-salary/salary-setting";

@Component({
  templateUrl: 'template-salary.component.html'
})
export class TemplateSalaryComponent implements OnInit {
  branches$ = this.store.pipe(select(getAllOrgchart));
  numberChars = new RegExp('[^0-9]', 'g');
  formGroup!: FormGroup;
  submitted = false;
  blockSalary = blockSalariesConstant;
  branches = new FormControl();
  branchesSelected: Branch[] = [];
  constraint: SalaryTypeEnum[] = []
  compareFN = (o1: any, o2: any) => (o1.type == o2.type || o1 === o2.type);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { template: SalarySetting, isUpdate: boolean },
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly message: NzMessageService,
    private readonly dialogRef: MatDialogRef<TemplateSalaryComponent>
  ) {
  }

  ngOnInit() {
    this.store.dispatch(OrgchartActions.init());
    if (this.data?.template) {
      this.formGroup = this.formBuilder.group({
        block: [this.data.template.type, Validators.required],
        price: [this.data.template.price],
        title: [this.data.template.title],
        reference: [this.data.template.reference],
        workday: [],
        rate: [this.data.template.rate],
        constraintHoliday: [],
        constraintOvertime: [],
      });
    } else {
      this.formGroup = this.formBuilder.group({
        block: ['', Validators.required],
        price: [],
        recipes: [],
        reference: [{value: salaryReference.PRICE}],
        title: [],
        dive: [],
        workday: [null],
        rate: [],
        constraintHoliday: [],
        constraintOvertime: [],
      });
    }
    this.formGroup.get('block')?.valueChanges.subscribe(item => {
      if (item.type === SalaryTypeEnum.OVERTIME || item.type === SalaryTypeEnum.HOLIDAY) {
        this.message.info('Chức năng đang được phát triền')
        this.formGroup.get('block')?.setValue('')
      }
    })
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
    if (value.constraintHoliday) {
      this.constraint.push(SalaryTypeEnum.HOLIDAY)
    }
    if (value.constraintOvertime) {
      this.constraint.push(SalaryTypeEnum.OVERTIME)
    }
    const template = {
      title: value.title,
      settingType: value.block.type,
      rate: value.rate,
      constraint: this.constraint
    };
    if (value.block.type === SalaryTypeEnum.ABSENT) {
      if (value.reference.value === salaryReference.PRICE) {
        Object.assign(template, {
          workday: value.workday ? value.workday : null,
          price: value.price,
          types: null,
        })
      } else {
        Object.assign(template, {
          workday: value.workday ? value.workday : null,
          price: null,
          types: value.recipes
        })
      }
    }
    if (this.data?.isUpdate) {
      this.store.dispatch(TemplateSalaryAction.updateTemplate(
        {
          id: this.data.template.id,
          template: template
        }));
    } else {
      this.store.dispatch(TemplateSalaryAction.AddTemplate(
        {template: template}));
    }
    this.store.pipe(select(selectTemplateAdded)).subscribe(added => {
      if (added) {
        this.dialogRef.close(template);
      }
    });
  }

  removeBranchSelected(branch: Branch) {
    lodash.remove(this.branchesSelected, branch);
  }

}
