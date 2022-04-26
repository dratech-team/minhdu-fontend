import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DatetimeUnitEnum, EmployeeType, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {Branch} from '@minhdu-fontend/data-models';
import {NzMessageService} from 'ng-zorro-antd/message';
import {PriceType} from "../../enums";
import {blockSalariesConstant, recipesConstant} from "../../constants";
import {NzModalRef} from "ng-zorro-antd/modal";
import {Actions} from "@datorama/akita-ng-effects";
import {SettingSalaryActions, SettingSalaryQuery} from "../../state";
import {SalaryConstraintEntity, SalarySettingEntity} from "../../entities";
import {DiveEnum} from "../../enums/dive.enum";

@Component({
  templateUrl: 'setting-salary-dialog.component.html'
})
export class SettingSalaryDialogComponent implements OnInit {
  @Input() data?: { template?: SalarySettingEntity, isUpdate?: boolean }
  added$ = this.settingSalaryQuery.select(state => state.added);
  numberChars = new RegExp('[^0-9]', 'g');
  formGroup!: FormGroup;
  blockSalary = blockSalariesConstant;
  salaryTypeEnum = SalaryTypeEnum
  branches = new FormControl();
  branchesSelected: Branch[] = [];
  constraint: SalaryTypeEnum[] = []
  prices: number[] = []
  formControlPrice = new FormControl('');
  priceType = PriceType
  dateTimeUnit = DatetimeUnitEnum
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
      salaries: [template?.totalOf || []],
      totalOf: [template ? this.transformTotalOf(template.totalOf) : ''],
      unit: [template?.unit || DatetimeUnitEnum.MONTH],
      title: [template?.title, Validators.required],
      diveFor: [template?.workday ? DiveEnum.OTHER : DiveEnum.STANDARD],
      workday: [template?.workday],
      rate: [template?.rate, Validators.required],
      constraintHoliday: [template?.constraints ? this.checkConstraint(template?.constraints, SalaryTypeEnum.HOLIDAY) : false],
      constraintOvertime: [template?.constraints ? this.checkConstraint(template?.constraints, SalaryTypeEnum.OVERTIME) : false],
      insurance: [template?.type === SalaryTypeEnum.BASIC_INSURANCE],
      employeeType: [template?.employeeType || EmployeeType.EMPLOYEE_FULL_TIME],
    });
    this.formGroup.get('block')?.valueChanges.subscribe(item => {
      this.formGroup.get('reference')?.setValue('')
      this.formGroup.get('insurance')?.setValue(false)
      this.prices = []
      switch (item.type) {
        case SalaryTypeEnum.HOLIDAY:
          this.message.info('Chức năng đang được phát triền')
          this.formGroup.get('block')?.setValue('')
          break
        case SalaryTypeEnum.OVERTIME:
          this.formGroup.get('unit')?.setValue(DatetimeUnitEnum.DAY)
          break
        default:
          this.formGroup.get('unit')?.setValue(DatetimeUnitEnum.MONTH)
          break
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

  transformTotalOf(totalOf: SalaryTypeEnum[]) {
    if (totalOf.length > 0) {
      return recipesConstant.find(reference => reference.value === PriceType.BLOCK)
    } else {
      return recipesConstant.find(reference => reference.value === PriceType.PRICE)
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
      unit: value.unit,
      prices: this.formControlPrice.value ? this.prices.concat([this.formControlPrice.value]) : this.prices
    };
    if (value.block.type === SalaryTypeEnum.ABSENT ||
      value.block.type === SalaryTypeEnum.OVERTIME
    ) {
      if (value.block.type === SalaryTypeEnum.OVERTIME) {
        Object.assign(template, {
          employeeType: value.employeeType,
        })
      }
      if (value.block.type === SalaryTypeEnum.ABSENT) {
        Object.assign(template, {
          constraint: this.constraint
        })
      }
      if (!value.totalOf) {
        return this.message.warning('Chưa chọn tổng của ')
      }
      if (value.totalOf.value === PriceType.PRICE) {
        if (this.prices.length === 0 && !this.formControlPrice.value) {
          return this.message.warning('Chưa nhập giá tiền')
        }
        Object.assign(template, {
          workday: value.workday ? value.workday : null,
          totalOf: null,
        })
      } else {
        if (!value.salaries) {
          return this.message.warning('Chưa chọn loại lương')
        }
        Object.assign(template, {
          workday: value.workday ? value.workday : null,
          price: null,
          totalOf: value.salaries.map((recipe: any) => recipe),
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
      if (added) {
        this.modalRef.close(template);
      }
    })
  }

  validatePrices() {
    if(this.formGroup.value.insurance){
      if (this.formControlPrice.value) {
        if (this.prices.includes(this.formControlPrice.value)) {
          this.message.warning('Giá tiền đã tồn tại')
        } else {
          this.prices.push(this.formControlPrice.value)
          this.formControlPrice.setValue('', {emitEvent: false})
        }
      }
    }
  }

  onRemovePrice(price: number) {
    this.prices = this.prices.filter(val => val !== price)
  }
}
