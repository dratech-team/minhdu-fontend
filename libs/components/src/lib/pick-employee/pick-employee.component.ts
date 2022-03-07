import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {SalaryTypeEnum} from '@minhdu-fontend/enums';
import {Category, Employee} from '@minhdu-fontend/data-models';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {debounceTime, startWith, tap} from 'rxjs/operators';
import {of} from 'rxjs';
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

@Component({
  selector: 'app-pick-employee',
  templateUrl: './pick-employee.component.html'
})
export class PickEmployeeComponent implements OnInit {
  // @Input() employeeInit?: Employee;
  // @Input() employeesSelected: Employee[] = [];
  @Output() EventSelectEmployee = new EventEmitter<Employee[]>();
  employees$ = this.employeeService.pagination({take: 30, skip: 0,})
  pageSize = 30;
  pageIndex = 0;
  type = SalaryTypeEnum;
  employees: Employee[] = [];
  employeeId!: number;
  isEventSearch = false;
  isSelectAll = false;
  employeesSelected: Employee[] = []
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));
  loaded$ = this.store.pipe(select(selectEmployeeLoaded));

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
    private readonly snackbar: MatSnackBar,
  ) {
  }


  /*ngOnChanges(changes: SimpleChanges): void {
    if (changes.employeesSelected) {
      this.isSelectAll =
        this.employees.length > 1 &&
        this.employees.every((e) => this.employeesSelected.some(item => item.id === e.id));
    }
  }*/

  ngOnInit(): void {
    this.employeeService.pagination({take:this.pageSize, skip:this.pageIndex})
      .subscribe(val => this.employees = val.data)
    this.store.dispatch(PositionActions.loadPosition());
    this.store.dispatch(OrgchartActions.init());

    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.isEventSearch = true;
          const param = {
            take: this.pageSize,
            skip: this.pageIndex,
            name: val.name,
            branch: val?.branch ? val.branch : '',
            position: val?.position ? val.position : ''
          }

        })
      )
      .subscribe(val => this.employees = val.data);

    this.positions$ = searchAutocomplete(
      this.formGroup.get('position')?.valueChanges.pipe(startWith('')) || of(''),
      this.store.pipe(select(getAllPosition))
    );

    this.branches$ = searchAutocomplete(
      this.formGroup.get('branch')?.valueChanges.pipe(startWith('')) || of(''),
      this.branches$
    );
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
          if(!val.category){
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
      position: val?.position ? val.position : ''
    }
    this.employeeService.pagination(param).subscribe(val => {
      if (val.data.length > 0) {
        this.employees = this.employees.concat(val.data)
      } else {
        this.snackbar.open('Đã lấy hết nhân viên', '', {duration: 1500})
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
                employee: {take: this.pageSize, skip: this.pageIndex},
                isPickEmp: true
              }))
            }
          )
          delete employee.category
        }
      })
  }
}
