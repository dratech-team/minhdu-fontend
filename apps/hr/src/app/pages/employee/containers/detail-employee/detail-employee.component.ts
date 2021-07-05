import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import {
  DegreeLevelEnum,
  DegreeStatusEnum,
  DegreeTypeEnum,
  FlatSalary,
  FormalityEnum,
  RelationshipEnum
} from '@minhdu-fontend/enums';
import { MatDialog } from '@angular/material/dialog';
import { Degree, Employee, Relative } from '@minhdu-fontend/data-models';
import { AddEmployeeComponent } from '../../components/employee/add-employee.component';
import { AddRelativeComponent } from '../../components/relative/add-relative.component';
import { AddDegreeComponent } from '../../components/degree/add-degree.component';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { selectCurrentEmployee } from '../../+state/employee.selector';
import { EmployeeAction } from '../..';




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
  isNotFlat = FlatSalary.NOT_FLAT_SALARY;
  isFlat = FlatSalary.FLAT_SALARY;
  employee$ = this.store.pipe(select(selectCurrentEmployee(this.employeeId)));

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog
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
      width: '40%',
      data: { employee: employee }
    });
  }

  addAndUpdateRelative(employeeId: number, id?: number, relative?: Relative): void {
    this.dialog.open(AddRelativeComponent, {
      width: '40%',
      data: { employeeId: employeeId, id: id, relative: relative }
    });
  }

  deleteRelative(id: number, employeeId: number) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '30%'
    });
    dialogRef.afterClosed().subscribe(val => {
        if (val) {
          this.store.dispatch(EmployeeAction.deleteRelative({ id: id, employeeId: employeeId }));
        }
      }
    );

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
    dialogRef.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(EmployeeAction.deleteDegree({ id: id, employeeId: employeeId }));
      }
    });
  }

}
