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
  templateUrl: 'dialog-absent.component.html',
  styleUrls: ['dialog-absent.component.scss']
})
export class DialogAbsentComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g');
  type = SalaryTypeEnum;
  formGroup!: FormGroup;
  submitted = false;
  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<DialogAbsentComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }


  ngOnInit(): void {
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
        title:  this.data.type === this.type.ABSENT ? 'Vắng' :'Đi trễ'  ,
        type: typeof value.type === 'number' ? this.type.STAY :
                    !value.type? this.type.ABSENT: this.data.type,
        rate: value.rate,
        times: value.times && value !== 0 ? value.times : undefined,
        datetime: value.datetime ? new Date(value.datetime): undefined,
        forgot: value.forgot ? value.forgot : undefined,
        note: value.note,
        unit: value.unit ? value.unit : undefined,
        payrollId: this.data?.payroll?.id ? this.data.payroll.id : undefined
      }
    };
    this.dialogRef.close(salary);
  }
}
