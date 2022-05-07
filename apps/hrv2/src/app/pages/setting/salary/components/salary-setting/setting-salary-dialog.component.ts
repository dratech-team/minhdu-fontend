import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DatetimeUnitEnum, EmployeeType, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {Branch} from '@minhdu-fontend/data-models';
import {NzMessageService} from 'ng-zorro-antd/message';
import {PriceType} from "../../enums";
import {blockSalariesConstant} from "../../constants";
import {NzModalRef} from "ng-zorro-antd/modal";
import {Actions} from "@datorama/akita-ng-effects";
import {SettingSalaryActions, SettingSalaryQuery} from "../../state";
import {DiveEnum} from "../../enums/dive.enum";
import {SalaryTypePipe} from "../../pipes/salary-type.pipe";
import {AddOrUpdateSettingSalary} from "../../data/modal-setting-salary.data";

@Component({
  templateUrl: 'setting-salary-dialog.component.html'
})
export class SettingSalaryDialogComponent implements OnInit {
  @Input() data?: AddOrUpdateSettingSalary
  added$ = this.settingSalaryQuery.select(state => state.added);
  numberChars = new RegExp('[^0-9]', 'g');
  formGroup!: FormGroup;
  blockSalary = blockSalariesConstant;
  salaryTypeEnum = SalaryTypeEnum
  branches = new FormControl();
  branchesSelected: Branch[] = [];
  constraint: SalaryTypeEnum[] = []
  prices: number[] = []
  priceType = PriceType
  dateTimeUnit = DatetimeUnitEnum
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1 == o2.type || o1.type === o2.type : o1 === o2);

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly actions$: Actions,
    private readonly settingSalaryQuery: SettingSalaryQuery,
    private readonly message: NzMessageService,
    private readonly modalRef: NzModalRef,
    private readonly salaryType: SalaryTypePipe
  ) {
  }

  ngOnInit() {
    const template = this.data?.update?.template
    if (template?.prices && template?.prices?.length > 1) {
      this.prices = [...template.prices]
    }
    this.formGroup = this.formBuilder.group({
      block: [template?.type === SalaryTypeEnum.BASIC_INSURANCE ? this.blockSalary.find(block => block.type === SalaryTypeEnum.BASIC) :
        this.blockSalary.find(block => block.type === template?.type)
        , Validators.required],
      salaries: [template?.totalOf || []],
      totalOf: [template ? this.salaryType.transform(template.totalOf, 'filter') : ''],
      unit: [template?.unit || DatetimeUnitEnum.MONTH],
      title: [template?.title, Validators.required],
      diveFor: [template?.workday ? DiveEnum.OTHER : DiveEnum.STANDARD],
      workday: [template?.workday],
      rate: [template?.rate, Validators.required],
      constraintHoliday: [template?.constraints?.some(constraint => constraint.type === SalaryTypeEnum.HOLIDAY)],
      constraintOvertime: [template?.constraints?.some(constraint => constraint.type === SalaryTypeEnum.OVERTIME)],
      insurance: [template?.type === SalaryTypeEnum.BASIC_INSURANCE],
      employeeType: [template?.employeeType || EmployeeType.EMPLOYEE_FULL_TIME],
      prices: [template?.prices && template.prices.length === 1 ? template.prices[0] : '']
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

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;
    const template = this.mapTemplate(value)
    if (value.block.type === SalaryTypeEnum.ABSENT || value.block.type === SalaryTypeEnum.OVERTIME) {
      if (!value.totalOf) {
        return this.message.warning('Chưa chọn tổng của ')
      }

      if (value.totalOf.value === PriceType.PRICE) {
        if (this.prices.length === 0 && !value.prices) {
          return this.message.warning('Chưa nhập giá tiền')
        }
      } else {
        if (!value.salaries) {
          return this.message.warning('Chưa chọn loại lương')
        }
      }

      if (value.diveFor === DiveEnum.OTHER && !value.workday) {
        return this.message.warning('Chưa nhập số ngày tuỳ chọn')
      }
    }

    if (this.data?.update) {
      this.actions$.dispatch(SettingSalaryActions.update({
        id: this.data.update.template.id,
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

  mapTemplate(value: any) {
    const template = {
      title: value.title,
      settingType: value.block.type === SalaryTypeEnum.BASIC && value.insurance ?
        SalaryTypeEnum.BASIC_INSURANCE :
        value.block.type,
      rate: value.rate,
      unit: value.unit,
      prices: value.prices ? this.prices.concat([value.prices]) : this.prices
    };
    if (value.block.type === SalaryTypeEnum.ABSENT || value.block.type === SalaryTypeEnum.OVERTIME) {
      if (value.block.type === SalaryTypeEnum.ABSENT) {
        if (value.constraintHoliday) {
          this.constraint.push(SalaryTypeEnum.HOLIDAY)
        }
        if (value.constraintOvertime) {
          this.constraint.push(SalaryTypeEnum.OVERTIME)
        }
        Object.assign(template, {
          constraint: this.constraint
        })
      }
      if (value.totalOf.value === PriceType.PRICE) {
        Object.assign(template, {
          workday: value.workday ? value.workday : null,
          totalOf: null,
        })
      } else {
        Object.assign(template, {
          workday: value.workday ? value.workday : null,
          price: null,
          totalOf: value.salaries.map((recipe: any) => recipe),
        })
      }
    }
    return template
  }

  validatePrices() {
    if (this.formGroup.value.insurance) {
      if (this.formGroup.value.prices) {
        if (this.prices.includes(this.formGroup.value.prices)) {
          this.message.warning('Giá tiền đã tồn tại')
        } else {
          this.prices.push(this.formGroup.value.prices)
          this.formGroup.get('prices')?.setValue('', {emitEvent: false})
        }
      }
    }
  }

  onRemovePrice(price: number) {
    this.prices = this.prices.filter(val => val !== price)
  }
}
