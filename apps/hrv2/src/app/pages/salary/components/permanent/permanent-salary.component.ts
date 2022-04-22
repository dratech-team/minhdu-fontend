import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Role} from '../../../../../../../../libs/enums/hr/role.enum';
import {SalaryPayroll} from '@minhdu-fontend/data-models';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalRef} from "ng-zorro-antd/modal";
import {ResponseSalaryEntity} from "../../entities";
import {PayrollEntity} from "../../../payroll/entities";
import {SalaryPermanentService} from "../../service";
import {SettingSalaryActions, SettingSalaryQuery} from "../../../setting/salary/state";
import {SalaryTypeEnum} from "../../../setting/salary/enums";
import {Actions} from "@datorama/akita-ng-effects";
import {PayrollActions} from "../../../payroll/state/payroll.action";
import {PaginationDto} from "@minhdu-fontend/constants";
import {dataModalPermanentSalary} from "../../../payroll/entities/data-modal-permanent-salary";
import {catchError, map} from "rxjs/operators";
import {throwError} from "rxjs";

@Component({
  templateUrl: 'permanent-salary.component.html'
})
export class PermanentSalaryComponent implements OnInit {
  @Input() data!: dataModalPermanentSalary
  @Output() EmitSalariesSelected = new EventEmitter<SalaryPayroll[]>();
  salariesSetting$ = this.settingSalaryQuery.selectAll({
    filterBy: [
      (entity) => entity.type === SalaryTypeEnum.BASIC ||
        entity.type === SalaryTypeEnum.BASIC_INSURANCE
    ]
  }).pipe(
    map(templates => {
      if (this.data.update) {
        const template = templates.find(template => template.title === this.data.update?.salary.title)
        if (template) {
          this.formGroup.get('template')?.setValue(template)
        }
      }
      return templates
    })
  )
  salaryTypeEnum = SalaryTypeEnum;
  formGroup!: FormGroup;
  roleEnum = Role;
  role = localStorage.getItem('role');
  payrollSelected: PayrollEntity[] = [];
  salariesSelected: SalaryPayroll[] = [];
  stepIndex = 0;
  submitting = false;
  compareFn = (o1: any, o2: any) => o1 && o2 ? (o1.id === o2.id || o1 === o2.title) : o1 === o2;


  constructor(
    private readonly actions$: Actions,
    private readonly settingSalaryQuery: SettingSalaryQuery,
    private readonly message: NzMessageService,
    private readonly formBuilder: FormBuilder,
    private readonly modalRef: NzModalRef,
    private readonly service: SalaryPermanentService,
  ) {
  }

  ngOnInit(): void {
    if (this.data.add || this.data.update) {
      this.stepIndex = 1
    }
    if (this.data?.add) {
      this.payrollSelected = this.payrollSelected.concat([this.data.add.payroll])
    }
    this.actions$.dispatch(SettingSalaryActions.loadAll({
      search: {types: [SalaryTypeEnum.BASIC_INSURANCE, SalaryTypeEnum.BASIC]}
    }))
    if (this.data?.update?.multiple) {
      this.salariesSelected = this.data.update.multiple.salariesSelected;
    }
    const salary = this.data?.update?.salary
    this.formGroup = this.formBuilder.group({
      template: ['', Validators.required],
      price: [salary?.price, Validators.required],
      rate: [salary?.rate, Validators.required],
      unit: [salary?.unit]
    });
    this.formGroup.get('template')?.valueChanges.subscribe(template => {
      if (template.prices.length === 1) {
        this.formGroup.get('price')?.setValue(template.prices[0])
      }
      this.formGroup.get('unit')?.setValue(template.unit)
      this.formGroup.get('rate')?.setValue(template.rate)
    })
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;
    const salary = {
      type: value.template.type,
      title: value.template.title,
      price: value.price,
      note: value.note,
    };
    this.submitting = true
    if (this.data?.update) {
      Object.assign(salary, {salaryIds: this.salariesSelected.map(val => val.salary.id).concat(this.data.update.salary.id)})
      this.service.updateMany(salary).pipe(catchError(err => {
        return this.onSubmitError(err)
      })).subscribe(res => {
        if (this.data.update?.multiple) {
          this.actions$.dispatch(PayrollActions.loadAll({
            search: {take: PaginationDto.take, skip: PaginationDto.skip}
          }))
        } else {
          if (this.data.update?.salary.payrollId)
            this.actions$.dispatch(PayrollActions.loadOne({id: this.data.update.salary.payrollId}))
        }
        this.onCloseModal(res)
      })
    }
    if (this.data.add) {
      Object.assign(salary, {payrollIds: [this.payrollSelected.map(val => val.id)]})
      this.service.addOne(salary).pipe(catchError(err => this.onSubmitError(err))).subscribe(res => {
        if (this.data.add?.payroll.id)
          this.actions$.dispatch(PayrollActions.loadOne({id: this.data.add?.payroll.id}))
        this.onCloseModal(res)
      })
    }
  }


  onCloseModal(res: ResponseSalaryEntity) {
    this.submitting = false
    this.message.success(res.message)
    this.modalRef.close()
  }

  onSubmitError(err: string) {
    this.submitting = false
    return throwError(err)
  }


  pickPayroll(payrolls: PayrollEntity[]) {
    this.payrollSelected = [...payrolls];
  }

  changeSalariesSelected($event: SalaryPayroll[]) {
    this.salariesSelected = $event;
    this.EmitSalariesSelected.emit(this.salariesSelected);
  }

  pre(): void {
    this.stepIndex -= 1;
  }

  next(): void {
    this.stepIndex += 1;
  }
}
