import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SalaryTypeEnum} from '@minhdu-fontend/enums';
import {Branch} from '@minhdu-fontend/data-models';
import * as lodash from 'lodash';
import {NzMessageService} from 'ng-zorro-antd/message';
import {salaryReference} from "../../enums";
import {blockSalariesConstant} from "../../constants";
import {NzModalRef} from "ng-zorro-antd/modal";
import {Actions} from "@datorama/akita-ng-effects";
import {SettingSalaryQuery} from "../../state";
import {SettingSalaryActions} from "../../state";
import {SalaryConstraintEntity, SettingSalaryEntity} from "../../entities";

@Component({
  templateUrl: 'setting-salary-dialog.component.html'
})
export class SettingSalaryDialogComponent implements OnInit {
  @Input() data?: { template?: SettingSalaryEntity, isUpdate?: boolean }
  added$ = this.settingSalaryQuery.select(state => state.added);

  numberChars = new RegExp('[^0-9]', 'g');
  formGroup!: FormGroup;
  blockSalary = blockSalariesConstant;
  salaryTypeEnum = SalaryTypeEnum
  branches = new FormControl();
  branchesSelected: Branch[] = [];
  constraint: SalaryTypeEnum[] = []
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1 == o2.type || o1.type === o2.type : o1 === o2);

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly actions$: Actions,
    private readonly settingSalaryQuery: SettingSalaryQuery,
    private readonly message: NzMessageService,
    private readonly modalRef: NzModalRef
  ) {
  }

  ngOnInit() {
    const template = this.data?.template
    this.formGroup = this.formBuilder.group({
      block: [template?.type === SalaryTypeEnum.BASIC_INSURANCE ? this.blockSalary.find(block => block.type === SalaryTypeEnum.BASIC) :
        this.blockSalary.find(block => block.type === template?.type)
        , Validators.required],
      price: [template?.price],
      recipes: [],
      reference: [''],
      title: [template?.title, Validators.required],
      dive: [],
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

  checkConstraint(constraints: SalaryConstraintEntity[] | undefined, constraint: SalaryTypeEnum) {
    if (!constraints) {
      return false
    } else {
      return constraints.some(val => val.type === constraint)
    }
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
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
        constraint: this.constraint
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
    if (this.data?.isUpdate && this.data?.template) {
      this.actions$.dispatch(SettingSalaryActions.update({
        id: this.data.template.id,
        updates: template
      }))
    } else {
      this.actions$.dispatch(SettingSalaryActions.addOne({
        body: template
      }))
    }
    this.added$.subscribe(added => {
      if(added){
        this.modalRef.close(template);
      }
    })
  }

  removeBranchSelected(branch: Branch) {
    lodash.remove(this.branchesSelected, branch);
  }

}
