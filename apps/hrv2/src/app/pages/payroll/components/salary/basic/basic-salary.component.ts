import {DatePipe} from '@angular/common';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Role} from '../../../../../../../../../libs/enums/hr/role.enum';
import {SalaryPayroll} from '@minhdu-fontend/data-models';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalRef} from "ng-zorro-antd/modal";
import {PermanentSalaryEntity, ResponseSalaryEntity} from "../../../../salary/entities";
import {PayrollEntity} from "../../../entities";
import {SalaryPermanentService} from "../../../../salary/service";
import {SettingSalaryActions, SettingSalaryQuery} from "../../../../setting/salary/state";
import {SalaryTypeEnum} from "../../../../setting/salary/enums";
import {Actions} from "@datorama/akita-ng-effects";
import {getTemplateSalaryUtil} from "../../../utils/get-template-salary.util";
import {SalarySettingEntity} from "../../../../setting/salary/entities";
import {map} from "rxjs/operators";
import {PayrollActions} from "../../../state/payroll.action";
import {PaginationDto} from "@minhdu-fontend/constants";

@Component({
  templateUrl: 'basic-salary.component.html'
})
export class BasicSalaryComponent implements OnInit {
  @Input() data!: {
    salary?: PermanentSalaryEntity
    updateMultiple?: boolean,
    salariesSelected?: SalaryPayroll[]
    payroll: PayrollEntity,
    isHistory?: boolean
  }
  @Output() EmitSalariesSelected = new EventEmitter<SalaryPayroll[]>();
  salariesSetting$ = this.settingSalaryQuery.selectAll({
    filterBy: [(entity) => entity.type === SalaryTypeEnum.BASIC ||
      entity.type === SalaryTypeEnum.BASIC_INSURANCE]
  }).pipe(map(templates => {
    if (this.data?.salary?.setting) {
      this.formGroup.get('template')?.setValue(
        this.getTemplateSalary(templates, this.data.salary.setting.id))
    }
    return templates
  }))
  type = SalaryTypeEnum;
  formGroup!: FormGroup;
  checkSalary = true;
  roleEnum = Role;
  role = localStorage.getItem('role');
  payrollSelected: PayrollEntity[] = [];
  salariesSelected: SalaryPayroll[] = [];
  stepIndex = 0;

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
    this.actions$.dispatch(SettingSalaryActions.loadAll({
      search: {salaryType: SalaryTypeEnum.BASIC}
    }))
    if (this.data?.salariesSelected) {
      this.salariesSelected = this.data.salariesSelected;
    }
    const salary = this.data?.salary
    this.formGroup = this.formBuilder.group({
      template: [''],
      price: [salary?.price, Validators.required],
      rate: [salary?.rate, Validators.required],
    });
  }

  getTemplateSalary(template: SalarySettingEntity[], id?: number) {
    return getTemplateSalaryUtil(template, id)
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
      settingId: value.template.id
    };
    if (this.data?.salary) {
      Object.assign(salary, {salaryIds: this.salariesSelected.map(val => val.salary.id)})
      this.service.updateMany(salary).subscribe(res => {
        if (this.data.updateMultiple) {
          this.actions$.dispatch(PayrollActions.loadAll({
            search: {take: PaginationDto.take, skip: PaginationDto.skip}
          }))
        } else {
          this.actions$.dispatch(PayrollActions.loadOne({id: this.data?.payroll.id}))
        }
        this.onCloseModal(res)
      })
    } else {
      Object.assign(salary, {payrollIds: [this.payrollSelected.map(val => val.id)]})
      this.service.addOne(salary).subscribe(res => {
        this.actions$.dispatch(PayrollActions.loadOne({id: this.data?.payroll.id}))
        this.onCloseModal(res)
      })
    }
  }

  onCloseModal(res: ResponseSalaryEntity) {
    this.message.success(res.message)
    this.modalRef.close()
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
