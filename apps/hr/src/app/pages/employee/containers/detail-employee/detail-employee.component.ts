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
import { Employee } from '../../+state/employee.interface';
import { EmployeeService } from '../../service/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { selectCurrentEmployee } from '../../+state/employee.selector';
import { EmployeeAction } from '../../+state/employee.action';
import { AddRelativeComponent } from '../../components/relative/add-relative.component';
import { AddEmployeeComponent } from '../../components/employee/add-employee.component';
import { AddDegreeComponent } from '../../components/degree/add-degree.component';
import { Degree, Relative } from '@minhdu-fontend/data-models';

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
    private readonly employeeService: EmployeeService,
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
    this.store.dispatch(EmployeeAction.deleteRelative({ id: id, employeeId: employeeId }));
  }

  addAndUpdateDegree(employeeId: number, id?: number, degree?: Degree) {
    this.dialog.open(AddDegreeComponent, {
      width: '40%',
      data: { employeeId: employeeId, id: id, degree: degree }
    });
  }

  deleteDegree(employeeId: number, id: number) {
    this.store.dispatch(EmployeeAction.deleteDegree({ id: id, employeeId: employeeId }));
  }
}
