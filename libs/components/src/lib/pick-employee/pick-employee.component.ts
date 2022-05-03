import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {ConvertBoolean, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {Category, Employee} from '@minhdu-fontend/data-models';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {debounceTime, mergeMap, startWith, tap} from 'rxjs/operators';
import {combineLatest, forkJoin, of} from 'rxjs';
import {
  EmployeeAction,
  selectEmployeeLoaded,
  selectorAllEmployee,
  selectorTotalEmployee
} from '@minhdu-fontend/employee';
import {getAllPosition, PositionActions} from '@minhdu-fontend/orgchart-position';
import {getAllOrgchart, OrgchartActions} from '@minhdu-fontend/orgchart';
import {searchAutocomplete} from '@minhdu-fontend/utils';
import {checkIsSelectAllInit, handleValSubPickItems, pickAll, pickOne, someComplete} from '@minhdu-fontend/utils';
import {MatDialog} from "@angular/material/dialog";
import {DialogSharedComponent} from "../dialog-shared/dialog-shared.component";
import {CategoryService} from "../../../../employee/src/lib/+state/service/category.service";
import {EmployeeService} from "../../../../employee/src/lib/+state/service/employee.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BranchQuery, PositionQuery} from "@minhdu-fontend/orgchart-v2";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-pick-employee',
  templateUrl: './pick-employee.component.html'
})
export class PickEmployeeComponent implements OnInit {
  @Output() EventSelectEmployee = new EventEmitter<Employee[]>();
  positions$ = this.positionQuery.selectAll()
  branches$ = this.branchQuery.selectAll()
  loaded$ = this.store.pipe(select(selectEmployeeLoaded));

  pageSize = 30;
  pageIndex = 0;
  type = SalaryTypeEnum;
  employees: Employee[] = [];
  total!: number
  employeeId!: number;
  isEventSearch = false;
  isSelectAll = false;
  employeesSelected: Employee[] = []


  formGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    position: new FormControl('', Validators.required),
    branch: new FormControl('', Validators.required)
  });

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly categoryService: CategoryService,
    private readonly employeeService: EmployeeService,
    private readonly branchQuery: BranchQuery,
    private readonly positionQuery: PositionQuery,
    private readonly message: NzMessageService,
  ) {
  }

  ngOnInit(): void {
    this.employeeService.pagination({take: this.pageSize, skip: this.pageIndex, isFlatSalary: -1, status: 0})
      .subscribe(val => {
        this.employees = val.data;
        this.total = val.total
      })
    this.store.dispatch(PositionActions.loadPosition());
    this.store.dispatch(OrgchartActions.init());

    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        mergeMap(val => {
          this.isEventSearch = true;
          const param = {
            take: this.pageSize,
            skip: this.pageIndex,
            name: val.name,
            branch: val?.branch ? val.branch : '',
            position: val?.position ? val.position : '',
            isFlatSalary: -1,
            status: 0
          }
          return this.employeeService.pagination(param)
        })
      ).subscribe(res => {
      this.employees = res.data
      this.total = res.total
    });
  }

  updateSelect(employee: Employee) {
    this.isSelectAll = pickOne(employee, this.employeesSelected, this.employees).isSelectAll;
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
    this.EventSelectEmployee.emit(this.employeesSelected);
  }

  onSelectPosition(positionName: string) {
    this.formGroup.get('position')?.patchValue(positionName);
  }

  onSelectBranch(branchName: string) {
    this.formGroup.get('branch')?.patchValue(branchName);
  }

  onScroll() {
    this.isEventSearch = false;
    const val = this.formGroup.value;
    const param = {
      take: this.pageSize,
      skip: this.employees.length,
      name: val.name,
      branch: val?.branch ? val.branch : '',
      position: val?.position ? val.position : '',
      isFlatSalary: -1,
      status: 0
    }
    this.employeeService.pagination(param).subscribe(val => {
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
          this.categoryService.removeEmployee(employee.category.id, {employeeId: employee.id}).subscribe(_ => {
              this.store.dispatch(EmployeeAction.loadInit({
                employee: {take: this.pageSize, skip: this.pageIndex, status: 0},
                isPickEmp: true
              }))
            }
          )
          delete employee.category
        }
      })
  }
}
