import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {  Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { FlatSalary } from '@minhdu-fontend/enums';
import { Observable } from 'rxjs';
import { Employee } from '../../+state/employee/employee.interface';
import { EmployeeService } from '../../service/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateEmployeeComponent } from '../../components/update-employee/update-employee.component';
import { UpdateEmployeeEnum } from '../../components/update-employee/update-employee.enum';
import { LevelEnum } from '../../../../../../../../libs/enums/level.enum';
import { StatusEnum } from '../../../../../../../../libs/enums/degree-status.enum';
import { FormalityEnum } from '../../../../../../../../libs/enums/formality.enum';
import { RelationshipEnum } from '../../../../../../../../libs/enums/relationship.enum';
import { AddRelativeComponent } from '../../components/add-relative/add-relative.component';




@Component({
  templateUrl: 'detail-employee.component.html',
  styleUrls: ['detail-employee.component.scss'],
})
export class DetailEmployeeComponent implements OnInit{
  relationship = RelationshipEnum;
  formalityEnum = FormalityEnum;
  status = StatusEnum;
  level = LevelEnum;
  updateType = UpdateEmployeeEnum;
  employee$!:Observable<Employee>;
  isNotFlat = FlatSalary.NOT_FLAT_SALARY;
  isFlat = FlatSalary.FLAT_SALARY;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store<AppState>,
    private readonly employeeService: EmployeeService,
    private readonly dialog: MatDialog,
  ) {
  }
  ngOnInit() : void{
    this.employee$ = this.employeeService.getOne(this.employeeId);
  }

  get employeeId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  onDevelopment() {
  }
  update( employee: Employee ,type: string):void{
    this.dialog.open(UpdateEmployeeComponent,{
      width: '40%',
      data: {employee,type }
    })
  }

  addRelative(id: number ):void{
    this.dialog.open(AddRelativeComponent, {
      width: '40%',
      data:id
    });
  }
}
