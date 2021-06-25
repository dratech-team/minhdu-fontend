import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Payroll } from '../../+state/payroll.interface';
import { select, Store } from '@ngrx/store';
import { selectCurrentPayroll } from '../../+state/payroll.selector';
import { AppState } from '../../../../reducers';
import { PayrollAction } from '../../+state/payroll.action';

@Component({
  templateUrl: 'salary.component.html',
  styleUrls: ['salary.component.scss'],
})
export class SalaryComponent implements OnInit {
  formGroup!: FormGroup;
  type!: SalaryTypeEnum;
  result: any;
  payroll$ = this.store.pipe(select(selectCurrentPayroll(this.data?.id)));
  selected = 'ALLOWANCE';

  constructor(
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(PayrollAction.getPayroll({id:this.data?.id}))
    this.formGroup = this.formBuilder.group({
      title: [this.data?.salary?.title ?? '', Validators.required],
      price: [this.data?.salary?.price, Validators.required],
      type: [this.type, Validators.required],
      rate: [1, Validators.required],
      times: [Validators.required],
      datetime: [Validators.required],
      forgot: [false, Validators.required],
      note: ['', Validators.required],
    });
  }

  onSubmit(): any {
    const value = this.formGroup.value;
    const salary ={
      title: value.title === '' && this.type === 'ALLOWANCE' ? 'Tăng ca' :
      value.title === '' && this.type === 'ABSENT' ? 'Vắng' :
        value.title === '' && this.type === 'LATE' ? 'Đi trễ' :
          value.title,
      price: value.price,
      type: value.type === 'HOURLY_ALLOWANCE' ? 'ALLOWANCE' : value.type,
      rate: value.rate,
      times: value.times,
      datetime: value.datetime,
      forgot: value.forgot,
      note: value.note,
    };
    this.store.dispatch(PayrollAction.addSalary({salary : salary}));
  }
}
