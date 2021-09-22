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

@Component({
  templateUrl: 'salary.component.html',
  styleUrls: ['salary.component.scss']
})
export class SalaryComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g');
  employeeIds: number[] = [];
  price!: number;
  title!: string;
  templateOvertime$ = this.store.pipe(select(selectorAllTemplate));
  isManyPeople = false;
  type = SalaryTypeEnum;
  formGroup!: FormGroup;
  submitted = false;
  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<SalaryComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }


  ngOnInit(): void {
    switch (this.data.type) {
      case this.type.BASIC:
        this.formGroup = this.formBuilder.group({
          price: [this.data?.salary?.price, Validators.required],
          type: [this.data?.salary?.type ?
            this.data?.salary?.type : this.data.type
            , Validators.required],
          rate: [1, Validators.required]
        });
        break;
      case this.type.STAY:
        this.formGroup = this.formBuilder.group({
          price: [this.data?.salary?.price, Validators.required],
          type: [this.data.type, Validators.required],
          rate:  [1, Validators.required]
        });
        break;
      case this.type.ALLOWANCE:
        this.formGroup = this.formBuilder.group({
          title: [this.data?.salary?.title ?? '', Validators.required],
          unit: [this.data?.salary?.unit ? this.data?.salary?.unit : undefined, Validators.required],
          datetime: [
            this.datePipe.transform(
              this.data?.salary?.datetime, 'yyyy-MM-dd')
            , Validators.required],
          times: [this.data?.salary?.times ? this.data?.salary?.times : 0, Validators.required],
          price: [this.data?.salary?.price, Validators.required],
          note: [this.data?.salary?.note],
          type: [this.data?.salary?.type ?
            this.data?.salary?.type : this.data.type
            , Validators.required],
          rate: [1, Validators.required]
        });
        break;
      case this.type.ABSENT:
        this.formGroup = this.formBuilder.group({
          unit: [this.data?.salary?.unit ? this.data?.salary?.unit : undefined, Validators.required],
          datetime: [
            this.datePipe.transform(
              this.data?.salary?.datetime, 'yyyy-MM-dd')
            , Validators.required],
          forgot: [this.data?.salary?.forgot],
          times: [this.data?.salary?.times ? this.data?.salary?.times : 0, Validators.required],
          note: [this.data?.salary?.note],
          type: [this.data.type, Validators.required],
          rate: [1, Validators.required]
        });
        break;
    }
  }

  pickEmployees(employeeIds: number []): any {
    this.employeeIds = employeeIds;
  }
  get salariesStay(){
    return ['Phụ cấp ở lại', 'Phụ cấp điện thoại', 'Phụ cấp tiền ăn']
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
      return
    }
    const value = this.formGroup.value;
    const salary = {
      update: !!this.data.salary,
      data: {
        title: !value.title && value.type === this.type.BASIC_ISNURANCE ? 'Lương cơ bản trước bảo hiểm' :
          !value.title && value.type === this.type.BASIC ? 'Lương cơ bản' :
            !value.title && value.type === this.type.OVERTIME ? this.title :
              !value.title && this.data.type === this.type.ABSENT ? 'Vắng' :
                !value.title && this.data.type === this.type.LATE ? 'Đi trễ' :
                  !value.title && this.data.type === this.type.STAY? this.salariesStay[value.type]:
                    value.title
        ,
        price: this.data.type === this.type.OVERTIME ? this.price :
          typeof (value.price) === 'string' ? Number(value.price.replace(this.numberChars, '')) : value.price,
        type: typeof value.type === 'number' ? this.type.STAY :
                    !value.type? this.type.ABSENT: this.data.type,
        rate: value.rate,
        times: value.times && value !== 0 ? value.times : undefined,
        datetime: value.datetime ? new Date(value.datetime): undefined,
        forgot: value.forgot ? value.forgot : undefined,
        note: value.note,
        unit: value.unit ? value.unit : undefined,
        employeeIds: this.employeeIds.length > 0 ? this.employeeIds : undefined,
        payrollId: this.data?.payroll?.id ? this.data.payroll.id : undefined
      }
    };
    this.dialogRef.close(salary);
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
    this.price = data.price;
    this.title = data.title;
  }
}
