import {Component, ElementRef, Inject, Input, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../reducers';
import {EmployeeType, FlatSalary, RecipeType} from '@minhdu-fontend/enums';
import {getAllOrgchart, OrgchartActions} from '@minhdu-fontend/orgchart';
import {DatePipe} from '@angular/common';
import {EmployeeAction, selectEmployeeAdded} from '@minhdu-fontend/employee';
import {Branch, Employee, Position} from '@minhdu-fontend/data-models';
import {PositionService} from '@minhdu-fontend/orgchart';
import {BranchService} from '../../../../../../../../libs/orgchart/src/lib/services/branch.service';
import {checkInputNumber} from '@minhdu-fontend/utils';
import {RecipeTypesConstant} from '@minhdu-fontend/constants';
import {CategoryService} from '../../../../../../../../libs/employee/src/lib/+state/service/category.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalRef} from "ng-zorro-antd/modal";
import {map} from "rxjs/operators";
import {
  EmployeeTypeConstant
} from "../../../../../../../hrv2/src/app/pages/setting/salary/constants/employee-type.constant";

@Component({
  templateUrl: 'add-employee.component.html'
})
export class AddEmployeeComponent implements OnInit {
  @ViewChild('positionInput') inputPosition!: ElementRef;
  @ViewChild('branchInput') branchInput!: ElementRef;
  @Input() employeeInit?: Employee;
  @Input() isUpdate?: boolean;

  categories$ = this.categoryService.getAll();
  lstPosition: Position [] = [];
  branches$ = this.store.pipe(select(getAllOrgchart)).pipe(map(branches => {
    if (branches.length === 1) {
      this.formGroup.get('branch')?.setValue(branches[0], {emitEvent: false})
      if (branches[0].positions)
        this.lstPosition = branches[0].positions
    }
    return branches
  }));
  positionId?: number;
  flatSalary = FlatSalary;
  submitting = false;
  recipeType = RecipeType;
  typeEmployee = EmployeeType;
  recipeTypesConstant = RecipeTypesConstant;
  employeeTypeConstant = EmployeeTypeConstant

  formGroup!: FormGroup

  constructor(
    public datePipe: DatePipe,
    @Inject(LOCALE_ID) private locale: string,
    private readonly formBuilder: FormBuilder,
    private readonly message: NzMessageService,
    private readonly positionService: PositionService,
    private readonly branchService: BranchService,
    private readonly store: Store<AppState>,
    private readonly categoryService: CategoryService,
    private readonly modalRef: NzModalRef
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(OrgchartActions.init());
    if (this.employeeInit) {
      if (this.employeeInit?.branch?.positions) {
        this.lstPosition = this.employeeInit.branch.positions
      }
    }

    this.formGroup = this.formBuilder.group({
      identify: [this.employeeInit?.identify],
      issuedBy: [this.employeeInit?.issuedBy],
      birthplace: [this.employeeInit?.birthplace],
      idCardAt: [
        this.employeeInit?.idCardAt ?
          this.datePipe.transform(this?.employeeInit?.idCardAt, 'yyyy-MM-dd') : ''
      ],
      email: [this.employeeInit?.email],
      workday: [this.employeeInit?.workday],
      phone: [this.employeeInit?.phone],
      workPhone: [this.employeeInit?.workPhone],
      note: [this.employeeInit?.note],
      workedAt: [
        this.employeeInit?.workedAt ?
          this.datePipe.transform(this.employeeInit?.workedAt, 'yyyy-MM-dd') : ''
      ],
      createdAt: [
        this.employeeInit?.createdAt ?
          this.datePipe.transform(this.employeeInit?.createdAt, 'yyyy-MM-dd') : '', Validators.required
      ],
      isFlatSalary: [
        this.employeeInit?.isFlatSalary
          ? this.flatSalary.FLAT_SALARY
          : this.flatSalary.NOT_FLAT_SALARY
      ],
      lastName: [this.employeeInit?.lastName, Validators.required],
      address: [this.employeeInit?.address, Validators.required],
      gender: [this.employeeInit?.gender, Validators.required],
      birthday: [
        this.employeeInit?.birthday ?
          this.datePipe.transform(this.employeeInit?.birthday, 'yyyy-MM-dd') : '',
        Validators.required
      ],
      ethnicity: [this.employeeInit?.ethnicity],
      religion: [this.employeeInit?.religion],
      facebook: [this.employeeInit?.facebook],
      zalo: [this.employeeInit?.zalo],
      createAtContract: [''],
      expiredAtContract: [''],
      recipeType: [this.employeeInit?.recipeType || this.recipeType.CT2],
      employeeType: [this.employeeInit ?
        this.employeeInit.type : EmployeeType.EMPLOYEE_FULL_TIME, Validators.required],
      category: [this.employeeInit?.category?.id],
      province: [this.employeeInit?.ward?.district?.province, Validators.required],
      district: [this.employeeInit?.ward?.district, Validators.required],
      ward: [this.employeeInit?.ward, Validators.required],
      branch: [this.employeeInit?.branch, Validators.required],
      position: [this.employeeInit?.position, Validators.required]

    })

    this.formGroup.get('branch')?.valueChanges.subscribe((val: Branch) => {
      if (val.positions) {
        this.formGroup.get('position')?.setValue('')
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

  get f() {
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

    if (this.isUpdate && this.employeeInit) {
      this.store.dispatch(
        EmployeeAction.updateEmployee({
          id: this.employeeInit.id,
          employee: employee
        })
      );
    } else {
      this.store.dispatch(EmployeeAction.addEmployee({employee: employee}));
    }
    this.store.select(selectEmployeeAdded).subscribe(added => {
      if (added) {
        this.modalRef.close()
      }
    })
  }

  checkNumberInput(event: any) {
    return checkInputNumber(event);
  }

  compareFN = (o1: any, o2: any) => {
    return o1 && o2 ? o1.id == o2.id : o1 === o2
  };

  private mapEmployee(value: any) {
    return {
      id: this.employeeInit?.id,
      isFlatSalary: value.employeeType === EmployeeType.EMPLOYEE_FULL_TIME ?
        value.isFlatSalary === this.flatSalary.FLAT_SALARY : false,
      positionId: value.position.id,
      branchId: value.branch.id,
      workedAt: value.workedAt ? new Date(value.workedAt) : undefined,
      createdAt: value.createdAt ? new Date(value.createdAt) : undefined,
      lastName: value.lastName,
      gender: value.gender,
      phone: value.phone?.toString(),
      workPhone: value.workPhone?.toString(),
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
  }
}
