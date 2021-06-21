import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { FlatSalary } from '@minhdu-fontend/enums';
import { Employee } from '../../+state/employee.interface';
import { EmployeeService } from '../../service/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateEmployeeComponent } from '../../components/update-employee/update-employee.component';
import { UpdateEmployeeEnum } from '../../components/update-employee/update-employee.enum';
import { DegreeLevelEnum } from '../../../../../../../../libs/enums/degree-level.enum';
import { DegreeStatusEnum } from '../../../../../../../../libs/enums/degree-status.enum';
import { FormalityEnum } from '../../../../../../../../libs/enums/formality.enum';
import { RelationshipEnum } from '../../../../../../../../libs/enums/relationship.enum';
import { DegreeTypeEnum } from '../../../../../../../../libs/enums/degree-type.enum';
import { selectCurrentEmployee, } from '../../+state/employee.selector';
import { EmployeeAction } from '../../+state/employee.action';
import { Relative } from '../../../../../../../../libs/data-models/relative.interface';
import { AddRelativeComponent } from '../../components/relative/add-relative.component';




@Component({
  templateUrl: 'detail-employee.component.html',
  styleUrls: ['detail-employee.component.scss'],
})
export class DetailEmployeeComponent implements OnInit{
  degreeType = DegreeTypeEnum;
  relationship = RelationshipEnum;
  formalityEnum = FormalityEnum;
  status = DegreeStatusEnum;
  level = DegreeLevelEnum;
  updateType = UpdateEmployeeEnum;
  isNotFlat = FlatSalary.NOT_FLAT_SALARY;
  isFlat = FlatSalary.FLAT_SALARY;
  employee$ = this.store.pipe(select(selectCurrentEmployee(this.employeeId)));

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store<AppState>,
    private readonly employeeService: EmployeeService,
    private readonly dialog: MatDialog,
  ) {
  }
  ngOnInit() : void{

    this.store.dispatch(EmployeeAction.getEmployee({id:this.employeeId}))
  }

  get employeeId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  onDevelopment() {
  }
  update( employee?: Employee ,type?: string ,  relative?: Relative ):void{
    this.dialog.open(UpdateEmployeeComponent,{
      width: '40%',
      data: {employee,type, relative}
    })
  }

  addAndUpdateRelative( id: number, relative?:Relative):void{
    this.dialog.open(AddRelativeComponent, {
      width: '40%',
      data:{id: id , relative: relative}
    });
  }
}
