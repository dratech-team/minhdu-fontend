import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  LOCALE_ID,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../reducers';
import {EmployeeType, FlatSalary, RecipeType} from '@minhdu-fontend/enums';
import {getAllOrgchart, OrgchartActions} from '@minhdu-fontend/orgchart';
import {DatePipe} from '@angular/common';
import {PositionActions} from 'libs/orgchart/src/lib/+state/position';
import {EmployeeAction} from '@minhdu-fontend/employee';
import {Branch, Position} from '@minhdu-fontend/data-models';
import {first} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {PositionService} from '../../../../../../../../libs/orgchart/src/lib/services/position.service';
import {BranchService} from '../../../../../../../../libs/orgchart/src/lib/services/branch.service';
import {checkInputNumber} from '../../../../../../../../libs/utils/checkInputNumber.util';
import {RecipeTypesConstant} from '@minhdu-fontend/constants';
import {CategoryService} from '../../../../../../../../libs/employee/src/lib/+state/service/category.service';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  templateUrl: 'add-employee.component.html'
})
export class AddEmployeeComponent implements OnInit {
  @ViewChild('positionInput') inputPosition!: ElementRef;
  @ViewChild('branchInput') branchInput!: ElementRef;
  @Input() data!: any;
  @Output() onSubmitSuccess = new EventEmitter<boolean>()
  positionId?: number;
  formPosition = new FormControl(this.data?.employee?.position?.name);
  flatSalary = FlatSalary;
  formGroup!: FormGroup;
  lstPosition: Position [] = [];
  positions$ = new Observable<Position[]>();
  branches$ = this.store.pipe(select(getAllOrgchart));
  submitted = false;
  wardId!: number;
  recipeType = RecipeType;
  typeEmployee = EmployeeType;
  recipeTypesConstant = RecipeTypesConstant;
  categories$ = this.categoryService.getAll();

  constructor(
    public datePipe: DatePipe,
    @Inject(LOCALE_ID) private locale: string,
    private readonly formBuilder: FormBuilder,
    private readonly message: NzMessageService,
    private readonly positionService: PositionService,
    private readonly branchService: BranchService,
    private readonly store: Store<AppState>,
    private readonly categoryService: CategoryService,
  ) {
  }

  ngOnInit(): void {
    console.log("add employee init")
    this.store.dispatch(OrgchartActions.init());
    this.store.dispatch(PositionActions.loadPosition());
    if (this.data?.employee) {
      this.positionId = this.data.employee.position.id;
      this.wardId = this.data.employee.ward.id;
    }
    this.formGroup = this.formBuilder.group({
      identify: [this.data?.employee?.identify],
      issuedBy: [this.data?.employee?.issuedBy],
      birthplace: [this.data?.employee?.birthplace],
      idCardAt: [
        this?.data?.employee?.idCardAt ?
          this.datePipe.transform(this?.data?.employee?.idCardAt, 'yyyy-MM-dd') : ''
      ],
      email: [this.data?.employee?.email],
      workday: [this.data?.employee?.workday],
      phone: [this.data?.employee?.phone],
      workPhone: [this.data?.employee?.workPhone],
      note: [this.data?.employee?.note],
      workedAt: [
        this.data?.employee?.workedAt ?
          this.datePipe.transform(this.data?.employee?.workedAt, 'yyyy-MM-dd') : ''
      ],
      createdAt: [
        this.data?.employee?.createdAt ?
          this.datePipe.transform(this.data?.employee?.createdAt, 'yyyy-MM-dd') : ''
      ],
      isFlatSalary: [
        this.data?.employee?.isFlatSalary
          ? this.flatSalary.FLAT_SALARY
          : this.flatSalary.NOT_FLAT_SALARY
      ],
      lastName: [this.data?.employee?.lastName, Validators.required],
      address: [this.data?.employee?.address, Validators.required],
      gender: [this.data?.employee?.gender, Validators.required],
      birthday: [
        this.data?.employee?.birthday ?
          this.datePipe.transform(this.data?.employee?.birthday, 'yyyy-MM-dd') : '',
        Validators.required
      ],
      ethnicity: [this.data?.employee?.ethnicity],
      religion: [this.data?.employee?.religion],
      facebook: [this.data?.employee?.facebook],
      zalo: [this.data?.employee?.zalo],
      createAtContract: [''],
      expiredAtContract: [''],
      recipeType: [this.data?.employee?.recipeType || this.recipeType.CT2],
      employeeType: [this.data?.employee ?
        this.data.employee.type : EmployeeType.EMPLOYEE_FULL_TIME, Validators.required],
      category: [this.data?.employee?.category?.id],
      province: [this.data?.employee?.ward?.district?.province.name, Validators.required],
      district: [this.data?.employee?.ward?.district?.name, Validators.required],
      ward: [this.data?.employee?.ward?.name, Validators.required],
      branch: [this.data?.employee?.branch, Validators.required],
      position: [this.data?.employee?.position, Validators.required],

    });
    this.formGroup.get('branch')?.valueChanges.subscribe((val: Branch) => {
      if (val.positions) {
        this.lstPosition = val.positions
      }
    })

    this.formGroup.get('position')?.valueChanges.subscribe((val: Position) => {
      this.formGroup.get('workday')?.patchValue(val.workday)
    })

    this.formGroup.get('employeeType')?.valueChanges.subscribe(val => {
      if (val === EmployeeType.EMPLOYEE_SEASONAL) {
        this.formGroup.get('recipeType')?.setValue(RecipeType.CT3);
      }
    });
    this.branches$.pipe(first(value => value.length === 1)).subscribe(val => {
      this.formGroup.get('branch')?.setValue(val);
      if (val[0].positions) {
        this.lstPosition = val[0].positions
      }
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    const value = this.formGroup.value;
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }

    if (!this.positionId && this.formPosition.value && this.data?.employee) {
      return this.message.error('Chức vụ phải chọn không được nhập');
    }

    if (value.typeEmployee === EmployeeType.EMPLOYEE_FULL_TIME
      && !value.workday
    ) {
      return this.message.error('Chưa nhập ngày công chuẩn');
    }
    const employee = {
      id: this?.data?.employee?.id,
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
      wardId: this.wardId || this.data.employee.wardId,
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
    if (this.data) {
      this.store.dispatch(
        EmployeeAction.updateEmployee({
          id: this.data.employee.id,
          employee: employee
        })
      );
    } else {
      this.store.dispatch(EmployeeAction.addEmployee({employee: employee}));
    }
  }


  onSelectWard($event: number) {
    this.wardId = $event;
  }

  checkNumberInput(event: any) {
    return checkInputNumber(event);
  }

  compareFN = (o1: any, o2: any) => (o1 && o2 ?
    o1.id === o2.id : o1 === o2);

}
