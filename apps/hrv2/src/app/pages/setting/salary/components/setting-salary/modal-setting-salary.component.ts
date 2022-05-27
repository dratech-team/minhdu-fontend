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
import {
  BranchActions,
  BranchEntity,
  BranchQuery,
  PositionActions,
  PositionEntity,
  PositionQuery
} from "@minhdu-fontend/orgchart-v2";
import * as moment from "moment";

@Component({
  templateUrl: 'modal-setting-salary.component.html'
})
export class ModalSettingSalaryComponent implements OnInit {
  @Input() data?: AddOrUpdateSettingSalary
  added$ = this.settingSalaryQuery.select(state => state.added);
  branches$ = this.branchQuery.selectAll();
  positions$ = this.positionQuery.selectAll();
  loadingBranch$ = this.branchQuery.select(state => state.loading)
  loadingPosition$ = this.positionQuery.select(state => state.loading)

  blockSalary = blockSalariesConstant;
  salaryTypeEnum = SalaryTypeEnum
  priceType = PriceType
  dateTimeUnit = DatetimeUnitEnum


  branchesSelected: Branch[] = [];
  constraint: SalaryTypeEnum[] = []
  prices: number[] = []

  branches = new FormControl();
  formGroup!: FormGroup;

  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1 == o2.type || o1.type === o2.type : o1 === o2);
  compareFNId = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly actions$: Actions,
    private readonly settingSalaryQuery: SettingSalaryQuery,
    private readonly branchQuery: BranchQuery,
    private readonly positionQuery: PositionQuery,
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
    if (template?.branches) {
      this.actions$.dispatch(BranchActions.loadAll({}))
    }
    if (template?.positions) {
      this.actions$.dispatch(PositionActions.loadAll({}))
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
      prices: [template?.prices && template.prices.length === 1 ? template.prices[0] : ''],
      branches: [template?.branches || []],
      positions: [template?.positions || []],
      hasConstraints: [this.data?.update ? template?.hasConstraints : true],
      rangeDay: [
        this.data?.update
          ?
          (template?.startedAt
            ? [template?.startedAt, template?.endedAt]
            : [])
          : [new Date(), new Date()]
      ],
    });

    this.formGroup.get('block')?.valueChanges.subscribe(item => {
      this.formGroup.get('reference')?.setValue('')
      this.formGroup.get('insurance')?.setValue(false)
      if (item.branch) {
        this.actions$.dispatch(BranchActions.loadAll({}))
      }
      if (item.position) {
        this.actions$.dispatch(PositionActions.loadAll({}))
      }
      this.prices = []
      switch (item.type) {
        case SalaryTypeEnum.HOLIDAY:
          this.formGroup.get('unit')?.setValue(DatetimeUnitEnum.DAY)
          break
        case SalaryTypeEnum.OVERTIME:
          this.formGroup.get('unit')?.setValue(DatetimeUnitEnum.DAY)
          break
        default:
          this.formGroup.get('unit')?.setValue(DatetimeUnitEnum.MONTH)
          break
      }
    })

    this.formGroup.get('insurance')?.valueChanges.subscribe(_ => {
        this.prices = []
        this.formGroup.get('prices')?.setValue('')
      }
    )
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
    if (value.block.type === SalaryTypeEnum.ABSENT
      || value.block.type === SalaryTypeEnum.HOLIDAY
      || value.block.type === SalaryTypeEnum.OVERTIME) {
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
      type: value.block.type === SalaryTypeEnum.BASIC && value.insurance ?
        SalaryTypeEnum.BASIC_INSURANCE :
        value.block.type,
      rate: value.rate,
      unit: value.unit,
      prices: value.prices ? this.prices.concat([value.prices]) : this.prices
    };
    if (value.block.type === SalaryTypeEnum.ABSENT
      || value.block.type === SalaryTypeEnum.OVERTIME
      || value.block.type === SalaryTypeEnum.HOLIDAY
    ) {
      if (value.block.type === SalaryTypeEnum.ABSENT) {
        if (value.constraintHoliday) {
          this.constraint.push(SalaryTypeEnum.HOLIDAY)
        }
        if (value.constraintOvertime) {
          this.constraint.push(SalaryTypeEnum.OVERTIME)
        }
        Object.assign(template, {constraint: this.constraint})
      }

      Object.assign(template, value.block.branch === SalaryTypeEnum.OVERTIME
          ? {
            hasConstraints: value.hasConstraints,
          }
          : {},
        value.block.branch ?
          {branchIds: value.branches.map((branch: BranchEntity) => branch.id)}
          : {},
        value.block.position ?
          {positionIds: value.positions.map((position: PositionEntity) => position.id)}
          : {},
        value.totalOf.value === PriceType.PRICE
          ? {
            workday: value.workday ? value.workday : null,
            totalOf: null,
          }
          : {
            workday: value.workday ? value.workday : null,
            prices: [],
            totalOf: value.salaries.map((recipe: any) => recipe),
          },
        value.block.type === SalaryTypeEnum.HOLIDAY
          ? {
            startedAt: moment(value.rangeDay[0]).set(
              {
                hours: new Date().getHours(),
                minutes: new Date().getMinutes(),
                seconds: new Date().getSeconds()
              }
            ).toDate(),
            endedAt: moment(value.rangeDay[1]).set(
              {
                hours: new Date().getHours(),
                minutes: new Date().getMinutes(),
                seconds: new Date().getSeconds()
              }
            ).toDate(),
          }
          : {}
      )
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
