import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeAction } from '@minhdu-fontend/employee';
import { selectorAllTemplate } from '../../../template/+state/template-overtime/template-overtime.selector';
import { TemplateOvertimeAction } from '../../../template/+state/template-overtime/template-overtime.action';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TemplateOvertime } from '../../../template/+state/template-overtime/template-overtime.interface';
import { getAllPosition } from '../../../../../../../../libs/orgchart/src/lib/+state/position';


@Component({
  templateUrl: 'dialog-overtime-multiple.component.html'
})

export class DialogOvertimeMultipleComponent implements OnInit {
  positions = new FormControl();
  positions$ = this.store.pipe(select(getAllPosition));
  titleOvertimes = new FormControl();
  onAllowanceOvertime = false;
  numberChars = new RegExp('[^0-9]', 'g');
  employeeIds: number[] = [];
  allowEmpIds: number[] = [];
  price!: number;
  title!: string;
  unit!: string;
  rate!: number;
  times?: number;
  templateOvertime$ = this.store.pipe(select(selectorAllTemplate));
  isManyPeople = false;
  type = SalaryTypeEnum;
  formGroup!: FormGroup;
  submitted = false;
  templateId?: number;
  positionId?: number;
  unitOvertime?: DatetimeUnitEnum;
  datetimeUnitEnum = DatetimeUnitEnum;

  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<DialogOvertimeMultipleComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }


  ngOnInit(): void {
    this.store.dispatch(TemplateOvertimeAction.loadALlTemplate(
      {}));
    this.formGroup = this.formBuilder.group({
      datetime: [undefined, Validators.required],
      note: [''],
      times: [1],
      priceAllowance: [],
      titleAllowance: []
    });
    this.titleOvertimes.valueChanges.pipe(
      map(_ => {
        this.store.dispatch(TemplateOvertimeAction.loadALlTemplate(
          {
            positionId: this.positionId,
            unit: this.unitOvertime ? this.unitOvertime : ''
          }));
      })
    ).subscribe();
    this.templateOvertime$ = combineLatest([
      this.titleOvertimes.valueChanges.pipe(startWith('')),
      this.store.pipe(select(selectorAllTemplate))
    ]).pipe(
      map(([titleOvertime, TempLateOvertimes]) => {
        if (titleOvertime) {
          return TempLateOvertimes.filter((e) => {
            return e.title.toLowerCase().includes(titleOvertime?.toLowerCase());
          });
        } else {
          return TempLateOvertimes;
        }
      })
    );
    this.positions$ = combineLatest([
      this.positions.valueChanges.pipe(startWith('')),
      this.store.pipe(select(getAllPosition))
    ]).pipe(
      map(([position, positions]) => {
        if (position) {
          return positions.filter((e) => {
            return e.name.toLowerCase().includes(position?.toLowerCase());
          });
        } else {
          this.positionId = undefined;
          this.titleOvertimes.patchValue('');
          return positions;
        }
      })
    );
  }

  pickEmployees(employeeIds: number []): any {
    this.employeeIds = employeeIds;
    console.log(this.employeeIds, 'employeeIds');
  }

  pickAllowance(allowEmpIds: number[]) {
    this.allowEmpIds = allowEmpIds;
    console.log(this.allowEmpIds, 'allowance');
  }

  get f() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    if (!this.templateId) {
      return this.snackBar.open('chưa chọn loại tăng ca', '', { duration: 1000 });
    }
    if (this.employeeIds.length === 0) {
      return this.snackBar.open('chưa chọn nhân viên', '', { duration: 1000 });
    }
    const value = this.formGroup.value;
    if (this.unit && !value.times) {
      return this.snackBar.open('chưa nhập số giờ tăng ca', '', { duration: 1000 });
    }
    const salary = {
      title: this.title,
      price: this.price,
      type: this.data.type,
      rate: this.rate || this.data?.salary?.rate,
      times: value.times,
      datetime: value.datetime ? new Date(value.datetime) : undefined,
      note: value.note,
      unit: this.unit || undefined,
      employeeIds: this.employeeIds.length > 0 ? this.employeeIds : undefined,
      allowEmpIds: this.allowEmpIds.length > 0 ? this.allowEmpIds : undefined,
      allowance: value.titleAllowance && value.priceAllowance ?
        {
          title: value.titleAllowance,
          price: typeof value.priceAllowance === 'string'
            ? Number(value.priceAllowance.replace(this.numberChars, ''))
            : value.priceAllowance
        } : undefined
    };
    this.store.dispatch(PayrollAction.addSalary({ salary: salary }));
    this.dialogRef.close();
  }

  tabChanged($event: MatTabChangeEvent) {
    switch ($event.index) {
      case 2:
        this.isManyPeople = true;
        break;
      default:
        this.isManyPeople = false;
    }
  }

  pickOverTime(data: TemplateOvertime) {
    this.price = data.price;
    this.title = data.title;
    this.rate = data.rate;
    this.unit = data.unit;
    this.templateId = data.id;
  }

  checkAllowanceOvertime() {
    this.onAllowanceOvertime = !this.onAllowanceOvertime;
  }

  onSelectPosition(positionId: number) {
    this.positionId = positionId;
    this.store.dispatch(TemplateOvertimeAction.loadALlTemplate(
      {
        positionId: this.positionId,
        unit: this.unitOvertime ? this.unitOvertime : ''
      }));
    this.titleOvertimes.patchValue('');
  }

  selectUnitOvertime(unit?: DatetimeUnitEnum) {
    this.unitOvertime = unit;
    this.store.dispatch(TemplateOvertimeAction.loadALlTemplate(
      {
        positionId: this.positionId,
        unit: this.unitOvertime ? this.unitOvertime : ''
      }));
    this.titleOvertimes.patchValue('');
  }
}
