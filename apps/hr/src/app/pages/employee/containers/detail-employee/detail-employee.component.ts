import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Degree, Employee, Relative } from '@minhdu-fontend/data-models';
import {
  EmployeeAction,
  selectCurrentEmployee, selectEmployeeAdding
} from '@minhdu-fontend/employee';
import {
  DegreeLevelEnum,
  DegreeStatusEnum,
  DegreeTypeEnum,
  FlatSalary,
  FormalityEnum, RecipeType,
  RelationshipEnum
} from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { DevelopmentComponent } from '../../../../../../../../libs/components/src/lib/development/development.component';
import { AppState } from '../../../../reducers';
import { AddDegreeComponent } from '../../components/degree/add-degree.component';
import { DeleteEmployeeComponent } from '../../components/dialog-delete-employee/delete-employee.component';
import { UpdateContractComponent } from '../../components/dialog-update-contract/update-contract.component';
import { AddEmployeeComponent } from '../../components/employee/add-employee.component';
import { AddRelativeComponent } from '../../components/relative/add-relative.component';

@Component({
  templateUrl: 'detail-employee.component.html',
  styleUrls: ['detail-employee.component.scss']
})
export class DetailEmployeeComponent implements OnInit {
  formalityEnum = FormalityEnum;
  degreeType = DegreeTypeEnum;
  relationship = RelationshipEnum;
  status = DegreeStatusEnum;
  level = DegreeLevelEnum;
  recipeType = RecipeType;
  isNotFlat = FlatSalary.NOT_FLAT_SALARY;
  isFlat = FlatSalary.FLAT_SALARY;
  employee$ = this.store.pipe(select(selectCurrentEmployee(this.employeeId)));
  adding$ = this.store.pipe(select(selectEmployeeAdding));

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(EmployeeAction.getEmployee({ id: this.employeeId }));
  }

  get employeeId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  updateEmployee(employee: Employee): void {
    this.dialog.open(AddEmployeeComponent, {
      width: '60%',
      data: { employee: employee }
    });
  }

  deleteEmployee(employeeId: number, leftAt?: Date): void {
    this.dialog.open(DeleteEmployeeComponent, {
      width:'fit-content',
      data: { employeeId, leftAt }
    });
  }

  addAndUpdateRelative(
    employeeId: number,
    id?: number,
    relative?: Relative
  ): void {
    this.dialog.open(AddRelativeComponent, {
      width: '60%',
      data: { employeeId: employeeId, id: id, relative: relative }
    });
  }

  deleteRelative(id: number, employeeId: number) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '30%'
    });
    dialogRef.afterClosed().subscribe((val) => {
      if (val) {
        this.store.dispatch(
          EmployeeAction.deleteRelative({ id: id, employeeId: employeeId })
        );
      }
    });
  }

  addAndUpdateDegree(employeeId: number, id?: number, degree?: Degree) {
    this.dialog.open(AddDegreeComponent, {
      width: '40%',
      data: { employeeId: employeeId, id: id, degree: degree }
    });
  }

  deleteDegree(id: number, employeeId: number) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '30%'
    });
    dialogRef.afterClosed().subscribe((val) => {
      if (val) {
        this.store.dispatch(
          EmployeeAction.deleteDegree({ id: id, employeeId: employeeId })
        );
      }
    });
  }

  addOrUpdateBHYT(bhyt?: any) {
    this.dialog.open(DevelopmentComponent, { width: '30%' });
    // this.dialog.open(BHYTComponent, {
    //   width: '50%',
    //   data: {bhyt, update: !!bhyt}
    //
    //
    // });
  }

  updateContract(employee: Employee) {
    this.dialog.open(UpdateContractComponent, { width: '30%', data: employee });
  }

  historySalary(employee: Employee) {
    this.router.navigate(['phieu-luong/lich-su-luong', employee.id],
      { queryParams: { name: employee.lastName } }).then();
  }
}
