import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {DatetimeUnitEnum, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {TemplateSalaryAction} from '../../+state/teamlate-salary/template-salary.action';
import {selectTemplateAdded} from '../../+state/teamlate-salary/template-salary.selector';
import {getAllOrgchart, OrgchartActions} from '@minhdu-fontend/orgchart';
import {Branch} from '@minhdu-fontend/data-models';
import * as lodash from 'lodash';
import {NzMessageService} from 'ng-zorro-antd/message';
import {DiveTypeEnum, salaryReference} from "../../enums";
import {blockSalariesConstant} from "../../constants";
import {SalarySetting} from "../../+state/teamlate-salary/salary-setting";
import {recipesConstant, referencesTypeConstant} from "../../constants/references-type.constant";
import {UnitSalaryConstant} from "../../constants/unit-salary.constant";
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: 'template-salary.component.html'
})
export class TemplateSalaryComponent implements OnInit {
  branches$ = this.store.pipe(select(getAllOrgchart));
  numberChars = new RegExp('[^0-9]', 'g');
  formGroup!: FormGroup;
  submitted = false;
  blockSalary = blockSalariesConstant;
  unitConstant = UnitSalaryConstant
  salaryTypeEnum = SalaryTypeEnum
  branches = new FormControl();
  branchesSelected: Branch[] = [];
  constraint: SalaryTypeEnum[] = []
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1 == o2.type || o1.type === o2.type : o1 === o2);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { template: SalarySetting, isUpdate: boolean },
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly message: NzMessageService,
    private readonly dialogRef: MatDialogRef<TemplateSalaryComponent>,
    private readonly activeRouter: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.store.dispatch(OrgchartActions.init());
    const template = this.data?.template
    this.formGroup = this.formBuilder.group({
      block: [template?.type === SalaryTypeEnum.BASIC_INSURANCE ? this.blockSalary.find(block => block.type === SalaryTypeEnum.BASIC) :
        this.blockSalary.find(block => block.type === template?.type)
        , Validators.required],
      price: [template?.price],
      unit: [template?.unit || DatetimeUnitEnum.MONTH],
      recipes: [template?.types ? this.getRecipes(template.types) : []],
      reference: [template?.types?.length > 0 ? this.getReference(salaryReference.BLOCK) : this.getReference(salaryReference.PRICE)],
      title: [template?.title, Validators.required],
      dive: [template?.workday ? DiveTypeEnum.OTHER : DiveTypeEnum.STANDARD],
      workday: [template?.workday],
      rate: [template?.rate, Validators.required],
      constraintHoliday: [template?.constraints ? this.checkConstraint(template?.constraints, SalaryTypeEnum.HOLIDAY) : false],
      constraintOvertime: [template?.constraints ? this.checkConstraint(template?.constraints, SalaryTypeEnum.OVERTIME) : false],
      insurance: [template?.type === SalaryTypeEnum.BASIC_INSURANCE]
    });

    this.formGroup.get('block')?.valueChanges.subscribe(item => {
      if (item.type === SalaryTypeEnum.OVERTIME || item.type === SalaryTypeEnum.HOLIDAY) {
        this.message.info('Chức năng đang được phát triền')
        this.formGroup.get('block')?.setValue('')
      }
    })
  }


  checkConstraint(constraints: SalaryTypeEnum[] | undefined, constraint: SalaryTypeEnum) {
    if (!constraints) {
      return false
    } else {
      return constraints.some(val => val === constraint)
    }
  }

  getReference(salaryReference: salaryReference) {
    return referencesTypeConstant.find(referenceConstant => referenceConstant.value === salaryReference)
  }

  getRecipes(types: SalaryTypeEnum[]) {
    return recipesConstant.filter(value => types.includes(value.value))
  }

  get checkValid() {
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
      unit: value.unit,
      settingType: value.block.type === SalaryTypeEnum.BASIC && value.insurance ?
        SalaryTypeEnum.BASIC_INSURANCE :
        value.block.type,
      rate: value.rate,
      price: value.price
    };
    if (value.block.type === SalaryTypeEnum.ABSENT) {
      if (!value.reference) {
        return this.message.warning('Chưa chọn tổng của ')
      }
      Object.assign(template, {
        constraints: this.constraint
      })
      if (value.reference.value === salaryReference.PRICE) {
        if (!value.price) {
          return this.message.warning('Chưa nhập giá tiền')
        }
        Object.assign(template, {
          workday: value.workday ? value.workday : null,
          types: null,
        })
      } else {
        if (!value.recipes) {
          return this.message.warning('Chưa chọn loại lương')
        }
        Object.assign(template, {
          workday: value.workday ? value.workday : null,
          price: null,
          types: value.recipes.map((recipe: any) => recipe.value),
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
