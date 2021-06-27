import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { MatTabChangeEvent } from '@angular/material/tabs';


@Component({
  templateUrl: 'salary.component.html',
  styleUrls: ['salary.component.scss']
})
export class SalaryComponent implements OnInit {
  employeeIds: number[] = [];

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  isManyPeople = false;
  type = SalaryTypeEnum;
  formGroup!: FormGroup;
  result: any;
  selected = 'ALLOWANCE';

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      title: [this.data?.salary?.title ?? '', Validators.required],
      price: [this.data?.salary?.price, Validators.required],
      type: [this.data?.salary?.type ?
        this.data?.salary?.type : this.data.type
        , Validators.required],
      unit: [this.data?.salary?.unit ? this.data?.salary?.unit : 'HOUR', Validators.required],
      rate: [1, Validators.required],
      minutes: [null, Validators.required],
      times: [this.data?.salary?.times ? this.data?.salary?.times : null, Validators.required],
      datetime: [Validators.required],
      forgot: [false, Validators.required],
      note: ['', Validators.required],
      createdAt: [this.data?.salary?.createdAt, Validators.required]
    });
  }

  pickEmployees(employeeIds: number []): any {
    this.employeeIds = employeeIds
  }

  onSubmit(): any {
    const value = this.formGroup.value;
    return {
      update: !!this.data.salary,
      title: value.title === '' && this.data.type === this.type.ALLOWANCE ? 'Tăng ca' :
        value.title === '' && this.data.type === this.type.BASIC ? 'Lương cơ bản' :
          value.title === '' && this.data.type === this.type.BASIC_ISNURANCE ? 'Lương cơ bản trước bảo hiểm' :
            value.title === '' && this.data.unit === this.type.ABSENT ? 'Vắng' :
              value.title === '' && this.data.type === this.type.LATE ? 'Đi trễ' :
                value.title,
      price: value.price,
      type: value.type === null ? this.type.ABSENT : value.type,
      rate: value.rate,
      times: value?.times,
      datetime: value.datetime,
      forgot: value.forgot,
      note: value.note,
      unit: value.unit,
      employeeIds: this.employeeIds
    };
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
}
