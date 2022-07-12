import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Salary, SalaryPayroll } from '@minhdu-fontend/data-models';
import { DatetimeUnitEnum } from '@minhdu-fontend/enums';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { SalaryEntity } from '../../../salary/entities';

@Component({
  templateUrl: 'classify-salary.component.html',
})
export class ClassifySalaryComponent {
  @Input() data!: { type: 'SELECT' | 'REMOVE'; salary: SalaryEntity };
  dateTimeUnit = DatetimeUnitEnum;
  constructor(private readonly modalRef: NzModalRef) {}

  onSubmit(type: 'ONE' | 'ALL') {
    this.modalRef.close(type);
  }
}
