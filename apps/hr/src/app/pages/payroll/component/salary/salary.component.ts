import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { selectorAllTemplate } from '../../+state/template-overtime/template-overtime.selector';
import { TemplateOvertimeAction } from '../../+state/template-overtime/template-overtime.action';
import { TemplateOvertime } from '../../+state/template-overtime/template-overtime.interface';
import { DatePipe } from '@angular/common';


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

  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  isManyPeople = false;
  type = SalaryTypeEnum;
  formGroup!: FormGroup;

  ngOnInit(): void {
    if (this.data.type === this.type.OVERTIME) {
      this.store.dispatch(TemplateOvertimeAction.loadALlTemplate());
    }
    this.formGroup = this.formBuilder.group({
      title: [this.data?.salary?.title ?? '', Validators.required],
      price: [this.data?.salary?.price, Validators.required],
      type: [this.data?.salary?.type ?
        this.data?.salary?.type : this.data.type
        , Validators.required],
      unit: [this.data?.salary?.unit ? this.data?.salary?.unit : undefined, Validators.required],
      rate: [1, Validators.required],
      minutes: [null, Validators.required],
      times: [this.data?.salary?.times ? this.data?.salary?.times : undefined, Validators.required],
      datetime: [
        this.datePipe.transform(
          this.data?.salary?.datetime, 'yyyy-MM-dd')
        , Validators.required],
      forgot: [this.data?.salary?.forgot],
      note: [this.data?.salary?.note],
      createdAt: [this.data?.salary?.createdAt, Validators.required]
    });
  }

  pickEmployees(employeeIds: number []): any {
    this.employeeIds = employeeIds;
  }

  onSubmit(): any {
    const value = this.formGroup.value;
    return {
      update: !!this.data.salary,
      data: {
        title: value.title === '' && value.type === this.type.BASIC_ISNURANCE ? 'Lương cơ bản trước bảo hiểm' :
          value.title === '' && value.type === this.type.BASIC ? 'Lương cơ bản' :
            value.title === '' && value.type === this.type.OVERTIME ? this.title :
              value.title === '' && this.data.unit === this.type.ABSENT ? 'Vắng' :
                value.title === '' && this.data.type === this.type.LATE ? 'Đi trễ' :
                  value.title,
        price: this.data.type === this.type.OVERTIME ? this.price :
          typeof (value.price) === 'string' ? Number(value.price.replace(this.numberChars, '')) : value.price,
        type: value.type === null ? this.type.ABSENT : value.type,
        rate: value.rate,
        times: value.times ? value.times : undefined,
        datetime: value.datetime ? value.datetime : undefined,
        forgot: value.forgot ? value.forgot : undefined,
        note: value.note,
        unit: value.unit ? value.unit : undefined,
        employeeIds: this.employeeIds.length > 0 ? this.employeeIds : undefined,
        payrollId: this.data?.payroll?.id ? this.data.payroll.id : undefined
      }
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

  getPrice(data: TemplateOvertime) {
    this.price = data.price;
    this.title = data.title;
  }
}
