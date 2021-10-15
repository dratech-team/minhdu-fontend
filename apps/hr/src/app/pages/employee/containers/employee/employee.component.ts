import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import {
  EmployeeAction,
  selectEmployeeAdding,
  selectEmployeeLoaded,
  selectorAllEmployee
} from '@minhdu-fontend/employee';
import {
  ConvertBoolean,
  FlatSalary,
  Gender,
  SearchEmployeeType
} from '@minhdu-fontend/enums';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { select, Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import {
  getAllPosition,
  PositionActions
} from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { AppState } from '../../../../reducers';
import { DeleteEmployeeComponent } from '../../components/dialog-delete-employee/delete-employee.component';
import { AddEmployeeComponent } from '../../components/employee/add-employee.component';
import { PageTypeEnum } from '../../../../../../../../libs/enums/sell/page-type.enum';

@Component({
  templateUrl: 'employee.component.html'
})
export class EmployeeComponent implements OnInit {
  searchType = SearchEmployeeType;
  genderType = Gender;
  flatSalary = FlatSalary;
  convertBoolean = ConvertBoolean;
  pageTypeEnum = PageTypeEnum
  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;
  employees$ = this.store.pipe(select(selectorAllEmployee));
  loaded$ = this.store.pipe(select(selectEmployeeLoaded));
  adding$ = this.store.pipe(select(selectEmployeeAdding));
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));
  pageSize: number = 30;
  pageIndexInit = 0;
  isLeft = false;
  formGroup = new FormGroup({
    // code: new FormControl(''),
    name: new FormControl(''),
    gender: new FormControl(''),
    workedAt: new FormControl(''),
    flatSalary: new FormControl(''),
    position: new FormControl(''),
    branch: new FormControl('')
  });

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(
      EmployeeAction.loadInit({
        employee: { take: this.pageSize, skip: this.pageIndexInit, isLeft: this.isLeft }
      })
    );
    this.store.dispatch(PositionActions.loadPosition());
    this.store.dispatch(OrgchartActions.init());
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1500)
      )
      .subscribe(val => this.store.dispatch(EmployeeAction.loadInit({ employee: this.employee(val) })));

    this.positions$ = combineLatest([
      this.formGroup.get('position')!.valueChanges.pipe(startWith('')),
      this.store.pipe(select(getAllPosition))
    ]).pipe(
      map(([position, positions]) => {
        if (position) {
          return positions.filter((e) => {
            return e.name.toLowerCase().includes(position?.toLowerCase());
          });
        } else {
          return positions;
        }
      })
    );

    this.branches$ = combineLatest([
      this.formGroup.get('branch')!.valueChanges.pipe(startWith('')),
      this.branches$
    ]).pipe(
      map(([branch, branches]) => {
        if (branch) {
          return branches.filter((e) => {
            return e.name.toLowerCase().includes(branch?.toLowerCase());
          });
        } else {
          return branches;
        }
      })
    );
  }

  add(): void {
    this.dialog.open(AddEmployeeComponent, {
      width: '60%'
    });
  }

  delete($event: any): void {
    this.dialog.open(DeleteEmployeeComponent, {
      width: 'fit-content',
      data: { employeeId: $event.id , leftAt: $event.leftAt }
    });
  }

  employee(val: any) {
    const employee = {
      skip: this.pageIndexInit,
      take: this.pageSize,
      // code: val.code,
      name: val.name,
      gender: val.gender,
      position: val.position,
      branch: val.branch,
      workedAt: val.workedAt,
      isLeft: this.isLeft,
      isFlatSalary:
        val.flatSalary === this.flatSalary.FLAT_SALARY
          ? this.convertBoolean.TRUE
          : val.flatSalary === this.flatSalary.NOT_FLAT_SALARY
          ? this.convertBoolean.FALSE
          : val.flatSalary
    };
    if (val.workedAt) {
      return employee;
    } else {
      // delete employee.workedAt;
      return employee;
    }
  }

  onSelectPosition(positionName: string) {
    this.formGroup.get('position')!.patchValue(positionName);
  }

  onSelectBranch(branchName: string) {
    this.formGroup.get('branch')!.patchValue(branchName);
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(EmployeeAction.loadMoreEmployees({ employee: this.employee(val) }));
  }

  readAndUpdate($event: any): void {
    this.router.navigate(['ho-so/chi-tiet-nhan-vien', $event.id]).then();
  }

  onSelectEmployee() {
    this.isLeft = !this.isLeft;
    this.store.dispatch(EmployeeAction.loadInit({
      employee: { take: this.pageSize, skip: this.pageIndexInit, isLeft: this.isLeft }
    }));
  }

  permanentlyDeleted($event: any) {
    this.dialog.open(DeleteEmployeeComponent, {
      width: 'fit-content',
      data: { employee:$event , permanentlyDeleted: true }
    });
  }
}
