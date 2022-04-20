import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DatetimeUnitEnum, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../../reducers';
import {DatePipe} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PartialDayEnum} from '@minhdu-fontend/data-models';
import {PayrollAction} from '../../../+state/payroll/payroll.action';
import {selectedAddedPayroll, selectedAddingPayroll} from '../../../+state/payroll/payroll.selector';
import {Payroll} from "../../../+state/payroll/payroll.interface";
import {selectorAllTemplate} from "../../../../template/+state/teamlate-salary/template-salary.selector";
import {map} from "rxjs/operators";
import {SalarySetting} from "../../../../template/+state/teamlate-salary/salary-setting";
import * as moment from "moment";
import {tranFormSalaryType} from "../../../utils";
import {referencesTypeConstant} from "../../../../template/constants/references-type.constant";
import {DisableTimeConstant, SessionConstant} from "../../../constants";
import {UnitSalaryConstant} from "../../../../template/constants/unit-salary.constant";
import {salaryReference} from "../../../../template/enums";
import {TemplateSalaryAction} from "../../../../template/+state/teamlate-salary/template-salary.action";


@Component({
  templateUrl: 'dialog-timekeeping.component.html'
})
export class DialogTimekeepingComponent implements OnInit {
  templateSalary$ = this.store.select(selectorAllTemplate).pipe(
    map(templates => {
      templates.push({
        id: 0,
        title: 'Khác',
        type: SalaryTypeEnum.ABSENT,
        rate: 1,
        unit: DatetimeUnitEnum.MONTH,
        types: []
      })
      return templates
    })
  )
  formGroup!: FormGroup;
  references = referencesTypeConstant;
  selectedIndex = 0;
  unitMinute = false;
  payrollSelected: Payroll[] = [];
  tabIndex = 0;
  adding$ = this.store.select(selectedAddingPayroll)
  disableTimeStartConstant: number [] = []
  disableTimeEndConstant: number [] = []
  titleSession = SessionConstant
  unitConstant = UnitSalaryConstant
  partialDayEnum = PartialDayEnum
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);
  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<DialogTimekeepingComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: {
      isTimesheet?: boolean
    }
  ) {
  }


  ngOnInit(): void {
    this.store.dispatch(TemplateSalaryAction.loadALlTemplate({
      salaryType: SalaryTypeEnum.ABSENT
    }));
    this.formGroup = this.formBuilder.group({
      template: ['', Validators.required],
      title: [],
      rangeDay: [[]],
      price: [],
      startTime: [],
      endTime: [],
      note: [],
      rate: [1],
      unit: [],
      partialDay: [],
      constraintHoliday: [],
      constraintOvertime: [],
      reference: []
    });

    this.formGroup.get('template')?.valueChanges.subscribe(template => {
      if (template?.constraints) {
        this.formGroup.get('constraintHoliday')?.setValue(
          this.transFormConstraintType(template.constraints, SalaryTypeEnum.HOLIDAY)
        )
        this.formGroup.get('constraintOvertime')?.setValue(
          this.transFormConstraintType(template.constraints, SalaryTypeEnum.OVERTIME)
        )
      }
      this.formGroup.get('rate')?.setValue(template?.rate)
      this.formGroup.get('unit')?.setValue(template?.unit)
      this.formGroup.get('reference')?.setValue(template?.types ? salaryReference.BLOCK : salaryReference.PRICE)
    })

    this.formGroup.get('partialDay')?.valueChanges.subscribe(item => {
      if (item.value === PartialDayEnum.CUSTOM) {
        this.disableTimeStartConstant = [...DisableTimeConstant]
        this.disableTimeEndConstant = [...DisableTimeConstant]
      } else {
        this.formGroup.get('startTime')?.setValue(item.startTime)
        this.formGroup.get('endTime')?.setValue(item.endTime)
      }
    })
  }

  transFormConstraintType(constraints: SalaryTypeEnum [], salaryTypeEnum: SalaryTypeEnum): boolean {
    return constraints.some(constraint => constraint === salaryTypeEnum)
  }

  tranFormType(salaryTypes: SalaryTypeEnum[]): string {
    return tranFormSalaryType(salaryTypes)
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value
    const salary = {
      title: value.template.id === 0 ? value.title : value.template.title,
      partial: value.template.id === 0 ? PartialDayEnum.CUSTOM : value.partialDay.value,
      type: value.template.type,
      startedAt: value.rangeDay[0],
      endedAt: value.rangeDay[1],
      startTime: value.startTime ? moment(value.startTime).format('HH:mm:ss') : null,
      endTime: value.endTime ? moment(value.endTime).format('HH:mm:ss') : null,
      unit: value.unit,
      price: value.price,
      note: value.note,
      settingId: value.template?.id,
      payrollIds: this.payrollSelected.map(val => val.id)
    }

    this.store.dispatch(PayrollAction.addSalary({
      salary: salary, isTimesheet: this.data?.isTimesheet
    }));
    this.store.pipe(select(selectedAddedPayroll)).subscribe(added => {
      if (added) {
        this.dialogRef.close({
          datetime: value.rangeDay[0],
          title: salary.title
        });
      }
    });
  }

  onSelectAbsent(index: number) {
    this.selectedIndex = index;
  }

  pickPayroll(payrolls: Payroll[]) {
    this.payrollSelected = [...payrolls];
  }

  nextTab(tab: any) {
    this.tabIndex = tab._selectedIndex + 1;
  }

  previousTab(tab: any) {
    this.tabIndex = tab._selectedIndex - 1;
  }

  disabledHoursStart(): number[] {
    return this.disableTimeStartConstant
  }

  disabledHoursEnd(): number[] {
    return this.disableTimeEndConstant
  }
}
