import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { selectCurrentPayroll } from '../../+state/payroll.selector';
import { AppState } from '../../../../reducers';
import { PayrollAction } from '../../+state/payroll.action';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  templateUrl: 'salary.component.html',
  styleUrls: ['salary.component.scss'],
})
export class SalaryComponent implements OnInit {
  constructor(
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }
  manyPeople = false;
  type = SalaryTypeEnum;
  formGroup!: FormGroup;
  result: any;
  payroll$ = this.store.pipe(select(selectCurrentPayroll(this.data.payroll.id)));
  selected = 'ALLOWANCE';

  ngOnInit(): void {
    if(this.data.type === this.type.OVERTIME){
      this.store.dispatch(PayrollAction.getPayroll({id:this.data.payroll.id}))
    }
    this.formGroup = this.formBuilder.group({
      title: [this.data?.salary?.title ?? '', Validators.required],
      price: [this.data?.salary?.price, Validators.required],
      type: [this.data?.salary?.type?
        this.data?.salary?.type: this.data.type
        , Validators.required],
      unit: [this.data?.salary?.unit ?this.data?.salary?.unit : 'HOUR', Validators.required],
      rate: [1, Validators.required],
      minutes: [null , Validators.required],
      times: [this.data?.salary?.times ? this.data?.salary?.times : null, Validators.required],
      datetime: [Validators.required],
      forgot: [false, Validators.required],
      note: ['', Validators.required],
    });
  }

  onSubmit(): any {
    const value = this.formGroup.value;
    return {
      update: !!this.data.salary,
      title: value.title === '' && this.data.type === this.type.ALLOWANCE? 'Tăng ca' :
          value.title === '' && this.data.type === this.type.BASIC ? 'Lương cơ bản' :
          value.title === '' && this.data.type === this.type.BASIC ? 'Lương cơ bản trước bảo hiểm' :
          value.title === '' && this.data.unit === this.type.ABSENT ? 'Vắng' :
          value.title === '' && this.data.type === this.type.LATE ? 'Đi trễ' :
          value.title,
      price: value.price,
      type: value.type === null? this.type.ABSENT : value.type,
      rate: value.rate,
      times: value?.times,
      datetime: value.datetime,
      forgot: value.forgot,
      note: value.note,
      unit: value.unit,
    };
  }

  tabChanged($event: MatTabChangeEvent) {
    switch ($event.index) {
      case 2:
        this.manyPeople = true;
        break;
      default:
        this.manyPeople = false;
    }
    this.formGroup.reset();
  }
}
