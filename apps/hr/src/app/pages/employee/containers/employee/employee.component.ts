import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import {
  EmployeeAction,
  selectEmployeeLoaded,
  selectorAllEmployee
} from '@minhdu-fontend/employee';
import {
  ConvertBoolean,
  FlatSalary,
  Gender,
  SearchEmployeeType
} from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { debounceTime, map, startWith, tap } from 'rxjs/operators';
import { AppState } from '../../../../reducers';
import { DeleteEmployeeComponent } from '../../components/dialog-delete-employee/delete-employee.component';
import { AddEmployeeComponent } from '../../components/employee/add-employee.component';
import { getAllPosition, PositionActions } from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { Branch, Position } from '@minhdu-fontend/data-models';
import { combineLatest } from 'rxjs';
import { getAllOrgchart, init, OrgchartActions } from '@minhdu-fontend/orgchart';

@Component({
  templateUrl: 'employee.component.html'
})
export class EmployeeComponent implements OnInit {
  positions = new FormControl();
  branches = new FormControl();
  searchType = SearchEmployeeType;
  genderType = Gender;
  flatSalary = FlatSalary;
  convertBoolean = ConvertBoolean;
  contextMenuPosition = { x: '0px', y: '0px' };
  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;
  employees$ = this.store.pipe(select(selectorAllEmployee));
  loaded$ = this.store.pipe(select(selectEmployeeLoaded));
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));
  pageSize: number = 30;
  pageIndexInit = 0;
  namePositionSearch = '';
  nameBranchSearch = '';
  formGroup = new FormGroup({
    code: new FormControl(''),
    name: new FormControl(''),
    gender: new FormControl(''),
    workedAt: new FormControl(''),
    flatSalary: new FormControl('')
  });

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(
      EmployeeAction.loadInit({ take: this.pageSize, skip: this.pageIndexInit })
    );
    this.store.dispatch(PositionActions.loadPosition());
    this.store.dispatch(OrgchartActions.init());
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.store.dispatch(EmployeeAction.loadInit(this.employee(val)));
        })
      )
      .subscribe();

    ///FIXME: Chưa work đc giá trị ban đầu
    this.positions$ = combineLatest([
      this.positions.valueChanges.pipe(startWith('')),
      this.store.pipe(select(getAllPosition))
    ]).pipe(
      map(([position, positions]) => {
        if (position) {
          return positions.filter((e) => {
            return e.name.toLowerCase().includes(position?.toLowerCase());
          });
        } else {
          this.namePositionSearch = ''
          return positions;
        }
      })
    );
    //search branch and position
    combineLatest([
      this.positions.valueChanges.pipe(startWith('')),
      this.branches.valueChanges.pipe(startWith(''))
    ]).pipe(
      debounceTime(2000),
      tap(_ =>{
        const  val = this.formGroup.value
        this.store.dispatch(EmployeeAction.loadInit(this.employee(val)));
      })
    ).subscribe()

    //Auto complete
    this.branches$ = combineLatest([
      this.branches.valueChanges.pipe(startWith('')),
      this.branches$
    ]).pipe(
      map(([branch, branches]) => {
        if (branch) {
          return branches.filter((e) => {
            return e.name.toLowerCase().includes(branch?.toLowerCase());
          });
        } else {
          this.nameBranchSearch = ''
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
    const dialogRef = this.dialog.open(DeleteEmployeeComponent, {
      minWidth: '30%'
    });
    dialogRef.afterClosed().subscribe((val) => {
      if (val) {
        this.store.dispatch(EmployeeAction.deleteEmployee({ id: $event.id }));
      }
    });
  }

  employee(val: any) {
    const employee = {
      skip: this.pageIndexInit,
      take: this.pageSize,
      code: val.code,
      name: val.name,
      gender: val.gender,
      position: this.namePositionSearch,
      branch: this.nameBranchSearch,
      workedAt: val.workedAt,
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
      delete employee.workedAt;
      return employee;
    }
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(EmployeeAction.loadMoreEmployees(this.employee(val)));
  }

  readAndUpdate($event: any): void {
    this.router.navigate(['ho-so/chi-tiet-nhan-vien', $event.id]).then();
  }

  onSelectPosition(position: Position) {
    this.namePositionSearch = position.name;
  }

  onSelectBranch(branchName: string) {
    this.nameBranchSearch = branchName;
  }
}
