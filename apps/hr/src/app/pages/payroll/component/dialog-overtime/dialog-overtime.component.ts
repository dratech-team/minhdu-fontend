import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { selectorAllTemplate } from '../../+state/template-overtime/template-overtime.selector';
import { TemplateOvertimeAction } from '../../+state/template-overtime/template-overtime.action';
import { TemplateOvertime } from '../../+state/template-overtime/template-overtime.interface';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../../../../../../libs/components/src/lib/snackBar/snack-bar.component';
import * as lodash from 'lodash';
import { map } from 'rxjs/operators';
import { PayrollAction } from '../../+state/payroll/payroll.action';

@Component({
  templateUrl: 'dialog-overtime.component.html',
  styleUrls: ['dialog-overtime.component.scss']
})
export class DialogOvertimeComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g');
  employeeIds: number[] = [];
  price!: number;
  title!: string;
  templateOvertime$ = this.store.pipe(select(selectorAllTemplate));
  isManyPeople = false;
  type = SalaryTypeEnum;
  formGroup!: FormGroup;
  submitted = false;
  checkposition!: number
  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<DialogOvertimeComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }


  ngOnInit(): void {
    this.store.dispatch(TemplateOvertimeAction.loadALlTemplate(
      { positionId: this.data?.payroll?.employee?.position?.id }));
    this.formGroup = this.formBuilder.group({
      unit: [this.data?.salary?.unit ? this.data?.salary?.unit : undefined, Validators.required],
      datetime: [
        this.datePipe.transform(
          this.data?.salary?.datetime, 'yyyy-MM-dd')
        , Validators.required],
      rate: [this.data?.salary?.rate, Validators.required],
      price: [this.data?.salary?.price, Validators.required],
      times: [this.data?.salary?.times ? this.data?.salary?.times : 0, Validators.required],
      note: [this.data?.salary?.note]
    });
  }
  pickEmployees(employeeIds: number []): any {
    this.employeeIds = employeeIds;
  }

  get f() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    if (this.formGroup.value.unit === 'HOUR' &&
      this.formGroup.value.times === 0) {
      this.snackBar.openFromComponent(SnackBarComponent,
        {
          data: { content: 'Số giờ phải lơn hơn 0' },
          panelClass: ['background-snackbar-validate'],
          duration: 2500
        });
      return;
    }
    const value = this.formGroup.value;
    const salary = {
      title: this.title,
      price: this.price,
      type: this.data.type,
      rate: this.data.rate,
      times: value.times && value !== 0 ? value.times : undefined,
      datetime: value.datetime || undefined,
      note: value.note,
      unit: value.unit || undefined,
      employeeIds: this.employeeIds.length > 0 ? this.employeeIds : undefined,
      payrollId: this.data?.payroll?.id ? this.data.payroll.id : undefined

    };
    if (this.data.salary) {
      this.store.dispatch(PayrollAction.updateSalary({ payrollId: this.data.payrollId, salary: salary }));
    } else {
      this.store.dispatch(PayrollAction.addSalary({ payrollId: this.data.payrollId, salary: salary }));
    }
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

  getPrice(data: TemplateOvertime) {
    console.log(data)
    this.price = data.price;
    this.title = data.title;
    this.checkposition = data.positionId
  }
}
