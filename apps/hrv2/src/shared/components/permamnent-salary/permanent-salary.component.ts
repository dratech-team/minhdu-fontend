import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SalaryTypeEnum} from '@minhdu-fontend/enums';
import {Observable} from 'rxjs';
import {NzMessageService} from 'ng-zorro-antd/message';
import {DatePipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'minhdu-fontend-permanent-salary',
  templateUrl: 'permanent-salary.component.html'
})
export class PermanentSalaryComponent implements OnInit {
  @Input() data!: {
    update?: {
      //fixme salary :{payroll: Payroll}
      salaries: any[],
      tempLateSalary?: any,
    },
    type: SalaryTypeEnum.STAY | SalaryTypeEnum.BASIC | SalaryTypeEnum.HISTORY,
  };
  templateSalaries$ = new Observable<any>();
  added$ = new Observable();

  formGroup!: FormGroup;
  salaryType = SalaryTypeEnum;
  stepIndex = 0;

  constructor(
    private readonly modalRef: NzModalRef,
    private readonly activatedRoute: ActivatedRoute,
    private readonly datePipe: DatePipe,
    private readonly formBuilder: FormBuilder,
    private readonly message: NzMessageService
  ) {

  }

  ngOnInit() {

    this.formGroup = this.formBuilder.group({
      type: [this.data.type, Validators.required],
      title: [this.data?.update?.tempLateSalary.title, Validators.required],
      price: [this.data?.update?.tempLateSalary.price, Validators.required],
      rate: [this.data?.update?.tempLateSalary.rate],
      note: [this.data?.update?.tempLateSalary?.note],
      datetime: [this.data.type === SalaryTypeEnum.HISTORY ?
        this.datePipe.transform(this.data?.update?.tempLateSalary?.datetime, 'yyyy-MM-dd') : ''],
      payrolls: [this.data?.update?.salaries.map(salary => salary.payroll)],
    });

    this.formGroup.get('title')?.valueChanges.subscribe(template => {
      if (template.price === 1) {
        this.formGroup.get('title')?.setValue(template.price[0]);
      }
    });
  }

  get payrollId(): number {
    return +this.activatedRoute.snapshot.params.id;
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit() {

    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value
    if (this.data.type === SalaryTypeEnum.HISTORY) {
      return; //api update lịch sử lương cho nhân viên
    }
    if (this.data?.update) {
      const salaryIds = value.payrolls.map((payroll: any) =>
        this.data.update?.salaries.map(salary => {
          if (salary.payroll.id === payroll.id) {
            salary.id
          }
        })
      )
      return; //api update
    } else {
      return;//api add salary
    }
  }

  pre(): void {
    this.stepIndex -= 1;
  }

  next(): any {
    // if (this.formGroup.invalid) {
    //   return;
    // }

    if (this.stepIndex > 0 && !this.formGroup.value.payrollIds) {
      return this.message.warning('Chưa chọn Nhân viên');
    }
    this.stepIndex += 1;
  }
}



