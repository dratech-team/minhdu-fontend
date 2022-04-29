import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Degree, Employee, Relative, Salary, WorkHistory} from '@minhdu-fontend/data-models';
import {
  DegreeLevelEnum,
  DegreeStatusEnum,
  DegreeTypeEnum,
  FormalityEnum,
  RecipeType,
  RelationshipEnum
} from '@minhdu-fontend/enums';
import {RecipeSalaryConstant} from "../../../../../../../../libs/constants/HR/recipe-salary.constant";
import {NzModalService} from "ng-zorro-antd/modal";
import {DatePipe} from "@angular/common";
import {EmployeeActions, EmployeeEntity, EmployeeQuery} from "@minhdu-fontend/employee-v2";
import {Actions} from "@datorama/akita-ng-effects";
import {FormalityTypeConstant} from "../../constants/formality-type.constant";
import {DegreeTypeConstant} from "../../constants/degree-type.constant";
import {RelationshipConstant} from "../../constants/relationship.constant";
import {GenderTypeConstant} from "@minhdu-fontend/constants";
import {DegreeLevelTypeConstant} from "../../constants/degree-level-type.constant";
import {DegreeStatusTypeConstant} from "../../constants/degree-status-type.constant";

@Component({
  templateUrl: 'detail-employee.component.html',
  styleUrls: ['detail-employee.component.scss']
})
export class DetailEmployeeComponent implements OnInit {
  employee$ = this.employeeQuery.selectEntity(this.employeeId)
  added$ = this.employeeQuery.select(state => state.added);

  formalityTypeConstant = FormalityTypeConstant;
  degreeConstant = DegreeTypeConstant
  relationshipConstant = RelationshipConstant;
  genderTypeConstant = GenderTypeConstant
  degreeLevelTypeConstant =DegreeLevelTypeConstant
  degreeStatusTypeConstant= DegreeStatusTypeConstant
  recipeConstant = RecipeSalaryConstant


  status = DegreeStatusEnum;
  level = DegreeLevelEnum;
  recipeType = RecipeType;
  isOpen = false;

  constructor(
    private readonly actions$: Actions,
    private readonly employeeQuery: EmployeeQuery,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly modal: NzModalService,
  ) {
  }

  ngOnInit(): void {
    this.actions$.dispatch(EmployeeActions.loadOne({id: this.employeeId}));
    this.activatedRoute.queryParams.subscribe(param => {
      const employee = this.employeeQuery.getEntity(this.employeeId)
      if (param.isUpdate && employee) {
        this.updateEmployee(employee);
      }
    });
  }

  get employeeId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  updateEmployee(employee: EmployeeEntity): void {
  }

  deleteEmployee(employee: EmployeeEntity, leftAt?: Date): void {
  }

  addAndUpdateRelative(employeeId: number, id?: number, relative?: Relative): void {

  }

  deleteRelative(id: number, employeeId: number) {
  }

  addAndUpdateDegree(employeeId: number, id?: number, degree?: Degree) {
  }

  deleteDegree(id: number, employeeId: number) {
  }

  addOrUpdateBHYT(bhyt?: any) {
  }

  updateContract(employee: EmployeeEntity) {
  }

  historySalary(employee: EmployeeEntity) {
    this.router.navigate(['phieu-luong/lich-su-luong', employee.id],
      {queryParams: {name: employee.lastName}}).then();
  }

  deleteWorkHistory(workHistory: WorkHistory, employeeId: number) {
  }

  eventEmit(event: boolean) {
    if (event) {
      this.isOpen = false;
    }
  }

  onUpdateHistorySalary(salary: Salary) {
  }

  deleteHistorySalary(salary: Salary) {
  }
}
