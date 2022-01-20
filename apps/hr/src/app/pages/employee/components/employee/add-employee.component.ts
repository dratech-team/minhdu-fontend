import {
  Component,
  Inject,
  LOCALE_ID,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { FlatSalary, RecipeType, EmployeeType } from '@minhdu-fontend/enums';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { DatePipe } from '@angular/common';
import {
  getAllPosition,
  PositionActions
} from 'libs/orgchart/src/lib/+state/position';
import { EmployeeAction, selectEmployeeAdded } from '@minhdu-fontend/employee';
import { Branch, Position } from '@minhdu-fontend/data-models';
import { map, startWith } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PositionService } from '../../../../../../../../libs/orgchart/src/lib/services/position.service';
import { BranchService } from '../../../../../../../../libs/orgchart/src/lib/services/branch.service';
import { checkInputNumber } from '../../../../../../../../libs/utils/checkInputNumber.util';
import { RecipeTypesConstant } from '@minhdu-fontend/constants';
import { searchAndAddAutocomplete } from '../../../../../../../../libs/utils/orgchart.ultil';

@Component({
  templateUrl: 'add-employee.component.html'
})
export class AddEmployeeComponent implements OnInit {
  @ViewChild('positionInput') inputPosition!: ElementRef;
  @ViewChild('branchInput') branchInput!: ElementRef;
  branchId?: number;
  positionId?: number;
  formPosition = new FormControl();
  branches = new FormControl();
  flatSalary = FlatSalary;
  formGroup!: FormGroup;
  positions$: Observable<Position[]> | undefined;
  branches$ = this.store.pipe(select(getAllOrgchart));
  submitted = false;
  wardId!: number;
  recipeType = RecipeType;
  typeEmployee = EmployeeType;
  recipeTypesConstant = RecipeTypesConstant
  constructor(
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(LOCALE_ID) private locale: string,
    private readonly formBuilder: FormBuilder,
    private readonly snackbar: MatSnackBar,
    private readonly positionService: PositionService,
    private readonly branchService: BranchService,
    private readonly store: Store<AppState>,
    private readonly dialogRef: MatDialogRef<AddEmployeeComponent>
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(OrgchartActions.init());
    this.store.dispatch(PositionActions.loadPosition());
    console.log(this.data)
      this.formGroup = this.formBuilder.group({
        identify: [this.data?.employee?.identify],
        issuedBy: [this.data?.employee?.issuedBy],
        birthplace: [this.data?.employee?.birthplace],
        idCardAt: [
          this.datePipe.transform(this?.data?.employee?.idCardAt, 'yyyy-MM-dd')
        ],
        email: [this.data?.employee?.email],
        workday: [this.data?.employee?.workday],
        phone: [this.data?.employee?.phone],
        note: [this.data?.employee?.note],
        workedAt: [
          this.datePipe.transform(this.data?.employee?.workedAt || '2010-01-01', 'yyyy-MM-dd')
        ],
        createdAt: [
          this.datePipe.transform(this.data?.employee?.createdAt || '2010-01-01', 'yyyy-MM-dd')
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
          this.datePipe.transform(this.data?.employee?.birthday || '2010-01-01', 'yyyy-MM-dd'),
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
          this.data.employee.type : EmployeeType.EMPLOYEE_FULL_TIME, Validators.required]
      });
      this.positions$ = searchAndAddAutocomplete(
        this.formPosition.valueChanges.pipe(startWith('')),
        this.store.pipe(select(getAllPosition))
      );

      this.branches$ = searchAndAddAutocomplete(
        this.branches.valueChanges.pipe(startWith('')),
        this.branches$
      );

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

    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }

    /// FIXME: dummy tạm
    if (!this.data) {
      if (!this.wardId || !this.branchId || !this.positionId) {
        return this.snackbar.open(
          'vui lòng nhập đầy đủ thông tin tỉnh/thành phố, quận/huyện, phường/xã hoặc chức vụ, đơn vị. Xin cảm ơn',
          'Đóng',
          { duration: 3000 }
        );
      }
    }

    const value = this.formGroup.value;
    console.log(value.recipeType)
    if(value.typeEmployee === EmployeeType.EMPLOYEE_FULL_TIME
      && !value.workday
    ){
      return  this.snackbar.open('Chưa nhập ngày công chuẩn', '', {duration:1500})
    }
    const employee = {
      id: this?.data?.employee?.id,
      isFlatSalary: value.typeEmployee === EmployeeType.EMPLOYEE_FULL_TIME ?
        value.isFlatSalary === this.flatSalary.FLAT_SALARY : undefined,
      positionId: this.positionId || this.data?.employee.positionId,
      branchId: this.branchId || this.data?.employee.branchId,
      workedAt: value.workedAt ? new Date(value.workedAt) : undefined,
      createdAt: value.createdAt ? new Date(value.createdAt) : undefined,
      lastName: value.lastName,
      gender: value.gender,
      phone: value.phone ? value.phone.toString() : undefined,
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
      workday: value.workday? value.workday: 0,
      type: value.employeeType,
      contract: {
        createdAt: value.createAtContract
          ? new Date(value.createAtContract)
          : undefined,
        expiredAt: value.expiredAtContract
          ? new Date(value.expiredAtContract)
          : undefined
      },
      recipeType: value.recipeType
    };
    if (this.data !== null) {
      this.store.dispatch(
        EmployeeAction.updateEmployee({
          id: this.data.employee.id,
          employee: employee
        })
      );
    } else {
      this.store.dispatch(EmployeeAction.addEmployee({ employee: employee }));
    }

    this.store.pipe(select(selectEmployeeAdded)).subscribe((added) => {
      if (added) {
        this.dialogRef.close();
      }
    });
  }

  onSelectPosition(event: any, position: Position) {
    if (event.isUserInput) {
      if (position.id) {
        this.positionId = position.id;
        this.formGroup.patchValue({
          workday: position.workday,
          position: position.name
        });
      } else {
        this.onCreatePosition();
      }
    }
  }

  onCreatePosition() {
    this.positionService
      .addOne({
        name: this.inputPosition.nativeElement.value,
        workday: this.formGroup.value.workday
      })
      .subscribe((position) => (this.positionId = position.id));
    this.snackbar.open('Đã tạo', '', { duration: 2500 });
  }

  /// FIXME: Duplicate code
  onCreateBranch(event: any, branch: Branch) {
    if (event.isUserInput) {
      if (branch.id === 0) {
        this.branchService
          .addOne({ name: this.branchInput.nativeElement.value })
          .subscribe((branch) => (this.branchId = branch.id));
        this.snackbar.open('Đã tạo', '', { duration: 2500 });
      } else {
        this.branchId = branch.id;
      }
    }
  }

  onSelectWard($event: number) {
    this.wardId = $event;
  }

  checkNumberInput(event: any) {
    return checkInputNumber(event);
  }
}
