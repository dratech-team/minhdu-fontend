import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  EmployeeStatusEnum,
  FlatSalaryTypeEnum,
  SalaryTypeEnum,
} from '@minhdu-fontend/enums';
import { Employee } from '@minhdu-fontend/data-models';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { debounceTime, mergeMap } from 'rxjs/operators';
import { pickOne, someComplete } from '@minhdu-fontend/utils';
import { MatDialog } from '@angular/material/dialog';
import { DialogSharedComponent } from '../dialog-shared/dialog-shared.component';
import { CategoryService, EmployeeService } from '@minhdu-fontend/employee';
import {
  BranchActions,
  BranchQuery,
  DepartmentActions,
  DepartmentQuery,
  PositionActions,
  PositionQuery,
} from '@minhdu-fontend/orgchart-v2';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PaginationDto } from '@minhdu-fontend/constants';
import { Actions } from '@datorama/akita-ng-effects';

@Component({
  selector: '@minhdu-fontend-pick-employee',
  templateUrl: './pick-employee.component.html',
})
export class PickEmployeeComponent implements OnInit {
  @Input() formGroup!: UntypedFormGroup;
  @Output() EventSelectEmployee = new EventEmitter<Employee[]>();
  positions$ = this.positionQuery.selectAll();
  branches$ = this.branchQuery.selectAll();
  removeEmp$ = this.departmentQuery.select((state) => state.loading);

  type = SalaryTypeEnum;
  employees: Employee[] = [];
  total!: number;
  employeeId!: number;
  isSelectAll = false;
  loading = true;
  loadMore = false;
  employeesSelected: Employee[] = [];

  formGroupTable = new UntypedFormGroup({
    name: new UntypedFormControl('', Validators.required),
    position: new UntypedFormControl('', Validators.required),
    branch: new UntypedFormControl('', Validators.required),
  });

  constructor(
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly categoryService: CategoryService,
    private readonly employeeService: EmployeeService,
    private readonly branchQuery: BranchQuery,
    private readonly departmentQuery: DepartmentQuery,
    private readonly positionQuery: PositionQuery,
    private readonly message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.employeeService.pagination(this.mapEmployee()).subscribe((val) => {
      this.loading = false;
      this.employees = val.data;
      this.total = val.total;
    });
    this.actions$.dispatch(BranchActions.loadAll({}));
    this.actions$.dispatch(PositionActions.loadAll({}));

    this.formGroupTable.valueChanges
      .pipe(
        debounceTime(1000),
        mergeMap((val) => {
          this.loading = true;
          return this.employeeService.pagination(this.mapEmployee());
        })
      )
      .subscribe((res) => {
        this.loading = false;
        this.employees = res.data;
        this.total = res.total;
      });
  }

  updateSelect(employee: Employee) {
    this.isSelectAll = pickOne(
      employee,
      this.employeesSelected,
      this.employees
    ).isSelectAll;
    this.formGroup
      .get('employeeIds')
      ?.setValue(this.employeesSelected.map((e) => e.id));
    this.EventSelectEmployee.emit(this.employeesSelected);
  }

  someComplete(): boolean {
    return someComplete(
      this.employees,
      this.employeesSelected,
      this.isSelectAll
    );
  }

  setAll(select: boolean) {
    this.isSelectAll = select;
    this.employees.forEach((val) => {
      if (select) {
        if (!this.employeesSelected.some((x) => x.id === val.id)) {
          if (!val.category) {
            this.employeesSelected.push(val);
          }
        }
      } else {
        const index = this.employeesSelected.findIndex((x) => x.id === val.id);
        if (index > -1) {
          this.employeesSelected.splice(index, 1);
        }
      }
    });
    this.formGroup
      .get('employeeIds')
      ?.setValue(this.employeesSelected.map((e) => e.id));
    this.EventSelectEmployee.emit(this.employeesSelected);
  }

  onScroll() {
    this.loadMore = true;
    this.employeeService
      .pagination(
        Object.assign({}, this.mapEmployee(), { skip: this.employees.length })
      )
      .subscribe((val) => {
        this.loadMore = false;
        this.total = val.total;
        if (val.data.length > 0) {
          val.data.forEach((emp) => {
            if (this.employees.every((e) => e.id !== emp.id)) {
              this.employees.push(emp);
            }
          });
        } else {
          this.message.info('???? l???y h???t nh??n vi??n');
        }
      });
  }

  mapEmployee() {
    const val = this.formGroupTable.value;
    return {
      take: PaginationDto.subTake,
      skip: PaginationDto.skip,
      name: val.name,
      branch: val?.branch ? val.branch : '',
      position: val?.position ? val.position : '',
      isFlatSalary: FlatSalaryTypeEnum.ALL,
      status: EmployeeStatusEnum.IS_ACTIVE,
    };
  }

  checkEmployee(employee: Employee) {
    return this.employeesSelected.some((e) => e.id === employee.id);
  }

  removeEmpInCategory(employee: Employee) {
    this.dialog
      .open(DialogSharedComponent, {
        width: 'fit-content',
        data: {
          title: 'Xo?? nh??n vi??n kh???i danh m???c',
          description: `B???n c?? mu???n xo?? nh??n vi??n ${employee.lastName} kh???i danh muc ${employee.category?.name} `,
        },
      })
      .afterClosed()
      .subscribe((val) => {
        if (val && employee.category?.id) {
          this.actions$.dispatch(
            DepartmentActions.removeEmployee({
              id: employee.category.id,
              body: { employeeId: employee.id },
            })
          );
          this.removeEmp$.subscribe((val) => {
            if (val === false) {
              delete employee.category;
            }
          });
        }
      });
  }
}
