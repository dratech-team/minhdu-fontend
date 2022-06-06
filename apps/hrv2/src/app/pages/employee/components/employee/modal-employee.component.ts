import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EmployeeType, RecipeType} from '@minhdu-fontend/enums';
import {DatePipe} from '@angular/common';
import {checkInputNumber} from '@minhdu-fontend/utils';
import {RecipeTypesConstant} from '@minhdu-fontend/constants';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {map} from 'rxjs/operators';
import {
  BranchActions,
  BranchEntity,
  BranchQuery,
  DepartmentActions,
  DepartmentQuery,
  PositionEntity
} from '@minhdu-fontend/orgchart-v2';
import {Actions} from '@datorama/akita-ng-effects';
import {EmployeeActions, EmployeeQuery} from '@minhdu-fontend/employee-v2';
import {FlatSalaryTypeConstant} from '../../constants/flat-salary-type.constant';
import {FlatSalaryTypeEnum} from '../../enums/flat-salary-type.enum';
import {ModalEmployeeData} from '../../data/modal-employee.data';
import {EmployeeTypeConstant} from '../../constants/employee-type.constant';
import {
  BaseAddEmployeeDto,
  BaseUpdateEmployeeDto
} from "../../../../../../../../libs/employee-v2/src/lib/employee/dto/employee";

@Component({
  templateUrl: 'modal-employee.component.html'
})
export class ModalEmployeeComponent implements OnInit {
  @Input() data!: ModalEmployeeData;

  branches$ = this.branchQuery.selectAll().pipe(map(branches => {
    if (branches.length === 1) {
      this.formGroup.get('branch')?.setValue(branches[0], {emitEvent: false});
      if (branches[0].positions)
        this.lstPosition = branches[0].positions;
    }
    return branches;
  }));
  categories$ = this.departmentQuery.selectAll();
  loading$ = this.employeeQuery.select(state => state.loading);

  lstPosition: PositionEntity [] = [];
  flatSalaryTypeConstant = FlatSalaryTypeConstant.filter(item => item.value !== FlatSalaryTypeEnum.ALL);
  recipeTypesConstant = RecipeTypesConstant;
  employeeTypeConstant = EmployeeTypeConstant;
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
    private readonly modalRef: NzModalRef,
    private readonly departmentQuery: DepartmentQuery
  ) {
  }

  ngOnInit(): void {
    this.actions$.dispatch(BranchActions.loadAll({}));
    this.actions$.dispatch(DepartmentActions.loadAll({}))
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
      type: [employeeInit ?
        employeeInit.type : EmployeeType.FULL_TIME, Validators.required],
      category: [employeeInit?.category],
      province: [employeeInit?.ward?.district?.province, Validators.required],
      district: [employeeInit?.ward?.district, Validators.required],
      ward: [employeeInit?.ward, Validators.required],
      branch: [employeeInit?.branch, Validators.required],
      position: [employeeInit?.position, Validators.required]

    });

    this.formGroup.get('branch')?.valueChanges.subscribe((val: BranchEntity) => {
      if (val.positions) {
        this.formGroup.get('position')?.setValue('');
        this.lstPosition = val.positions;
      }
    });

    this.formGroup.get('position')?.valueChanges.subscribe((val: PositionEntity) => {
      this.formGroup.get('workday')?.patchValue(val.workday);
    });

    this.formGroup.get('type')?.valueChanges.subscribe(val => {
      if (val === EmployeeType.SEASONAL) {
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

    if (value.type === EmployeeType.FULL_TIME && !value.workday) {
      return this.message.error('Chưa nhập ngày công chuẩn');
    }

    const employee = this.mapEmployee(value);
    this.actions$.dispatch(this.data.update
      ? EmployeeActions.update({
        id: this.data.update.employee.id,
        updates: employee as BaseUpdateEmployeeDto
      })
      : EmployeeActions.addOne({body: employee as BaseAddEmployeeDto})
    );

    this.loading$.subscribe(loading => {
      if (loading === false) {
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

  mapEmployee(value: any): BaseAddEmployeeDto | BaseUpdateEmployeeDto {
    return {
      gender: value.gender,
      identify: value?.identify?.toString(),
      address: value.address,
      note: value.note || '',
      lastName: value.lastName,
      religion: value.religion,
      ethnicity: value.ethnicity,
      facebook: value.facebook,
      birthplace: value.birthplace,
      recipeType: value.recipeType,
      createdAt: new Date(value.createdAt),
      workedAt: value.workedAt ? new Date(value.workedAt) : undefined,
      workday: value.workday ? value.workday : 0,
      idCardAt: value.idCardAt ? new Date(value.idCardAt) : undefined,
      issuedBy: value.issuedBy,
      birthday: value.birthday ? new Date(value.birthday) : undefined,
      email: value.email ? value.email : undefined,
      isFlatSalary: value.type === EmployeeType.FULL_TIME ?
        value.isFlatSalary === FlatSalaryTypeEnum.FLAT_SALARY : false,
      positionId: value.position.id,
      branchId: value.branch.id,
      wardId: value.ward.id,
      zalo: value?.zalo ? value?.zalo?.toString() : undefined,
      type: value.type,
      contract: {
        createdAt: value.createAtContract
          ? new Date(value.createAtContract)
          : undefined,
        expiredAt: value.expiredAtContract
          ? new Date(value.expiredAtContract)
          : undefined
      },
      categoryId: value.category,
      phone: value.phone,
      workPhone: value.workPhone,
      mst: value.mst,
      bhyt: value.bhyt,
    }
  }
}
