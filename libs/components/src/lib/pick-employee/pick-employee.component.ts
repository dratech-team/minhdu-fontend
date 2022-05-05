import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SalaryTypeEnum} from '@minhdu-fontend/enums';
import {Employee} from '@minhdu-fontend/data-models';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {debounceTime, mergeMap} from 'rxjs/operators';
import {pickOne, someComplete} from '@minhdu-fontend/utils';
import {MatDialog} from "@angular/material/dialog";
import {DialogSharedComponent} from "../dialog-shared/dialog-shared.component";
import {CategoryService} from "../../../../employee/src/lib/+state/service/category.service";
import {EmployeeService} from "../../../../employee/src/lib/+state/service/employee.service";
import {BranchActions, BranchQuery, PositionActions, PositionQuery} from "@minhdu-fontend/orgchart-v2";
import {NzMessageService} from "ng-zorro-antd/message";
import {PaginationDto} from "@minhdu-fontend/constants";
import {Actions} from "@datorama/akita-ng-effects";

@Component({
  selector: '@minhdu-fontend-pick-employee',
  templateUrl: './pick-employee.component.html'
})
export class PickEmployeeComponent implements OnInit {
  @Input() formGroup!: FormGroup
  @Output() EventSelectEmployee = new EventEmitter<Employee[]>();
  positions$ = this.positionQuery.selectAll()
  branches$ = this.branchQuery.selectAll()

  type = SalaryTypeEnum;
  employees: Employee[] = [];
  total!: number
  employeeId!: number;
  isSelectAll = false;
  employeesSelected: Employee[] = []


  formGroupTable = new FormGroup({
    name: new FormControl('', Validators.required),
    position: new FormControl('', Validators.required),
    branch: new FormControl('', Validators.required)
  });

  constructor(
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly categoryService: CategoryService,
    private readonly employeeService: EmployeeService,
    private readonly branchQuery: BranchQuery,
    private readonly positionQuery: PositionQuery,
    private readonly message: NzMessageService,
  ) {
  }

  ngOnInit(): void {
    this.employeeService.pagination(this.mapEmployee())
      .subscribe(val => {
        this.employees = val.data;
        this.total = val.total
      })
    this.actions$.dispatch(BranchActions.loadAll({}))
    this.actions$.dispatch(PositionActions.loadAll({}))

    this.formGroupTable.valueChanges
      .pipe(
        debounceTime(1000),
        mergeMap(val => {
          return this.employeeService.pagination(this.mapEmployee())
        })
      ).subscribe(res => {
      this.employees = res.data
      this.total = res.total
    });
  }

  updateSelect(employee: Employee) {
    this.isSelectAll = pickOne(employee, this.employeesSelected, this.employees).isSelectAll;
    this.formGroup.get('employeeIds')?.setValue(this.employeesSelected.map(e => e.id))
    this.EventSelectEmployee.emit(this.employeesSelected);
  }

  someComplete(): boolean {
    return someComplete(this.employees, this.employeesSelected, this.isSelectAll);
  }

  setAll(select: boolean) {
    this.isSelectAll = select;
    this.employees.forEach(val => {
      if (select) {
        if (!this.employeesSelected.some(x => x.id === val.id)) {
          if (!val.category) {
            this.employeesSelected.push(val);
          }
        }
      } else {
        const index = this.employeesSelected.findIndex(x => x.id === val.id);
        if (index > -1) {
          this.employeesSelected.splice(index, 1);
        }
      }
    });
    this.formGroup.get('employeeIds')?.setValue(this.employeesSelected.map(e => e.id))
    this.EventSelectEmployee.emit(this.employeesSelected);
  }

  onScroll() {
    this.employeeService.pagination(
      Object.assign({}, this.mapEmployee(), {take: PaginationDto.take, skip: this.employees.length})
    ).subscribe(val => {
      this.total = val.total
      if (val.data.length > 0) {
        val.data.forEach(emp => {
          if (this.employees.every(e => e.id !== emp.id)) {
            this.employees.push(emp)
          }
        })
      } else {
        this.message.info('Đã lấy hết nhân viên')
      }
    })
  }

  mapEmployee() {
    const val = this.formGroupTable.value
    return {
      take: PaginationDto.take,
      skip: PaginationDto.skip,
      name: val.name,
      branch: val?.branch ? val.branch : '',
      position: val?.position ? val.position : '',
      isFlatSalary: -1,
      status: 1
    }
  }


  checkEmployee(employee: Employee) {
    return this.employeesSelected.some((e) => e.id === employee.id);
  }

  removeEmpInCategory(employee: Employee) {
    this.dialog.open(DialogSharedComponent, {
      width: 'fit-content',
      data: {
        title: 'Xoá nhân viên khỏi danh mục',
        description: `Bạn có muốn xoá nhân viên ${employee.lastName} khỏi danh muc ${employee.category?.name} `
      }
    }).afterClosed()
      .subscribe(val => {
        if (val && employee.category?.id) {
          this.categoryService.removeEmployee(employee.category.id, {employeeId: employee.id}).subscribe()
          delete employee.category
        }
      })
  }
}
