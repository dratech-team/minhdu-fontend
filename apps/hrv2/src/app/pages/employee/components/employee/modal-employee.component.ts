import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeType, RecipeType } from '@minhdu-fontend/enums';
import { DatePipe } from '@angular/common';
import { Branch, Position } from '@minhdu-fontend/data-models';
import { checkInputNumber } from '@minhdu-fontend/utils';
import { RecipeTypesConstant } from '@minhdu-fontend/constants';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { map } from 'rxjs/operators';
import { BranchActions, BranchQuery } from '@minhdu-fontend/orgchart-v2';
import { Actions } from '@datorama/akita-ng-effects';
import { EmployeeActions, EmployeeQuery } from '@minhdu-fontend/employee-v2';
import { FlatSalaryTypeConstant } from '../../constants/flat-salary-type.constant';
import { FlatSalaryTypeEnum } from '../../enums/flat-salary-type.enum';
import { Observable } from 'rxjs';
import { ModalEmployeeData } from '../../data/modal-employee.data';
import { DirtyCheckPlugin } from '@datorama/akita';

@Component({
  templateUrl: 'modal-employee.component.html'
})
export class ModalEmployeeComponent implements OnInit, OnDestroy {
  @Input() data!: ModalEmployeeData;

  branches$ = this.branchQuery.selectAll().pipe(map(branches => {
    if (branches.length === 1) {
      this.formGroup.get('branch')?.setValue(branches[0], { emitEvent: false });
      if (branches[0].positions)
        this.lstPosition = branches[0].positions;
    }
    return branches;
  }));
  categories$ = new Observable<any>();
  added$ = this.employeeQuery.select('added');

  lstPosition: Position [] = [];
  flatSalaryTypeConstant = FlatSalaryTypeConstant.filter(item => item.value !== FlatSalaryTypeEnum.ALL);
  recipeTypesConstant = RecipeTypesConstant;

  submitting = false;
  recipeType = RecipeType;
  typeEmployee = EmployeeType;
  formGroup!: FormGroup;

  constructor(
    public datePipe: DatePipe,
    private readonly actions$: Actions,
    private readonly branchQuery: BranchQuery,
    private readonly employeeQuery: EmployeeQuery,
    private readonly formBuilder: FormBuilder,
    private readonly message: NzMessageService,
    private readonly modalRef: NzModalRef
  ) {
  }

  ngOnInit(): void {
    this.actions$.dispatch(BranchActions.loadAll({}));

    this.lstPosition = this.data?.update?.employee?.branch?.positions || [];
    const employeeInit = this.data?.add?.employee || this.data?.update?.employee;

    this.formGroup = this.formBuilder.group({
      identify: [employeeInit?.identify],
      issuedBy: [employeeInit?.issuedBy],
      birthplace: [employeeInit?.birthplace],
      idCardAt: [
        employeeInit?.idCardAt ?
          this.datePipe.transform(employeeInit.idCardAt, 'yyyy-MM-dd') : ''
      ],
      email: [employeeInit?.email],
      workday: [employeeInit?.workday],
      phone: [employeeInit?.phone],
      workPhone: [employeeInit?.workPhone],
      note: [employeeInit?.note],
      workedAt: [
        employeeInit?.workedAt ?
          this.datePipe.transform(employeeInit.workedAt, 'yyyy-MM-dd') : ''
      ],
      createdAt: [
        employeeInit?.createdAt ?
          this.datePipe.transform(employeeInit.createdAt, 'yyyy-MM-dd') : '', Validators.required
      ],
      isFlatSalary: [
        employeeInit?.isFlatSalary
          ? FlatSalaryTypeEnum.FLAT_SALARY
          : FlatSalaryTypeEnum.NOT_FLAT_SALARY
      ],
      lastName: [employeeInit?.lastName, Validators.required],
      address: [employeeInit?.address, Validators.required],
      gender: [employeeInit?.gender, Validators.required],
      birthday: [
        employeeInit?.birthday ?
          this.datePipe.transform(employeeInit.birthday, 'yyyy-MM-dd') : '',
        Validators.required
      ],
      ethnicity: [employeeInit?.ethnicity],
      religion: [employeeInit?.religion],
      facebook: [employeeInit?.facebook],
      zalo: [employeeInit?.zalo],
      createAtContract: [''],
      expiredAtContract: [''],
      recipeType: [employeeInit?.recipeType || this.recipeType.CT2],
      employeeType: [employeeInit ?
        employeeInit.type : EmployeeType.EMPLOYEE_FULL_TIME, Validators.required],
      category: [employeeInit?.category?.id],
      province: [employeeInit?.ward?.district?.province, Validators.required],
      district: [employeeInit?.ward?.district, Validators.required],
      ward: [employeeInit?.ward, Validators.required],
      branch: [employeeInit?.branch, Validators.required],
      position: [employeeInit?.position, Validators.required]

    });

    this.formGroup.get('branch')?.valueChanges.subscribe((val: Branch) => {
      if (val.positions) {
        this.formGroup.get('position')?.setValue('');
        this.lstPosition = val.positions;
      }
    });

    this.formGroup.get('position')?.valueChanges.subscribe((val: Position) => {
      this.formGroup.get('workday')?.patchValue(val.workday);
    });

    this.formGroup.get('employeeType')?.valueChanges.subscribe(val => {
      if (val === EmployeeType.EMPLOYEE_SEASONAL) {
        this.formGroup.get('recipeType')?.setValue(RecipeType.CT3);
      }
    });
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    this.submitting = true;
    const value = this.formGroup.value;

    if (this.formGroup.invalid) {
      return;
    }

    if (value.typeEmployee === EmployeeType.EMPLOYEE_FULL_TIME && !value.workday) {
      return this.message.error('Chưa nhập ngày công chuẩn');
    }

    const employee = this.mapEmployee(value);

    this.actions$.dispatch(this.data.add
      ? EmployeeActions.addOne({ body: employee })
      : EmployeeActions.update({
        id: this.data.update.employee.id,
        updates: employee
      })
    );

    this.added$.subscribe(added => {
      if (added) {
        this.modalRef.close();
      }
    });
  }

  checkNumberInput(event: any) {
    return checkInputNumber(event);
  }

  compareFN = (o1: any, o2: any) => {
    return o1 && o2 ? o1.id == o2.id : o1 === o2;
  };

  mapEmployee(value: any) {
    const emp = {
      isFlatSalary: value.employeeType === EmployeeType.EMPLOYEE_FULL_TIME ?
        value.isFlatSalary === FlatSalaryTypeEnum.FLAT_SALARY : false,
      positionId: value.position.id,
      branchId: value.branch.id,
      workedAt: value.workedAt ? new Date(value.workedAt) : undefined,
      createdAt: value.createdAt ? new Date(value.createdAt) : undefined,
      lastName: value.lastName,
      gender: value.gender,
      birthday: value.birthday ? new Date(value.birthday) : undefined,
      birthplace: value.birthplace,
      identify: value?.identify?.toString(),
      idCardAt: value.idCardAt ? new Date(value.idCardAt) : undefined,
      issuedBy: value.issuedBy,
      wardId: value.ward.id,
      address: value.address,
      religion: value.religion ? value.religion : undefined,
      ethnicity: value.ethnicity ? value.ethnicity : undefined,
      email: value.email ? value.email : undefined,
      facebook: value?.facebook ? value.facebook : undefined,
      zalo: value?.zalo ? value?.zalo?.toString() : undefined,
      note: value.note ? value.note : undefined,
      workday: value.workday ? value.workday : 0,
      type: value.employeeType,
      contract: {
        createdAt: value.createAtContract
          ? new Date(value.createAtContract)
          : undefined,
        expiredAt: value.expiredAtContract
          ? new Date(value.expiredAtContract)
          : undefined
      },
      recipeType: value.recipeType,
      categoryId: value.category
    };

    return Object.assign(emp,
      value.phone ? { phone: value.phone } : {},
      value.workPhone ? { workPhone: value.workPhone } : {}
    );
  }

  ngOnDestroy() {
  }
}
