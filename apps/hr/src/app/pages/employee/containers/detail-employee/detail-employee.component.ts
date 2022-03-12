import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {Degree, Employee, Relative, WorkHistory} from '@minhdu-fontend/data-models';
import {EmployeeAction, selectCurrentEmployee, selectEmployeeAdding} from '@minhdu-fontend/employee';
import {
  DegreeLevelEnum,
  DegreeStatusEnum,
  DegreeTypeEnum,
  FormalityEnum,
  RecipeType,
  RelationshipEnum
} from '@minhdu-fontend/enums';
import {Store} from '@ngrx/store';
import {DevelopmentComponent, DialogDeleteComponent} from '@minhdu-fontend/components';
import {AppState} from '../../../../reducers';
import {AddDegreeComponent} from '../../components/degree/add-degree.component';
import {DeleteEmployeeComponent} from '../../components/dialog-delete-employee/delete-employee.component';
import {UpdateContractComponent} from '../../components/dialog-update-contract/update-contract.component';
import {AddEmployeeComponent} from '../../components/employee/add-employee.component';
import {AddRelativeComponent} from '../../components/relative/add-relative.component';
import {getSelectors} from '@minhdu-fontend/utils';
import {RecipeSalaryConstant} from "../../../../../../../../libs/constants/HR/recipe-salary.constant";
import {
  DialogSharedComponent
} from "../../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component";

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
  recipeConstant = RecipeSalaryConstant
  employee$ = this.store.select(selectCurrentEmployee(this.employeeId));
  adding$ = this.store.select(selectEmployeeAdding);
  isOpen = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(EmployeeAction.getEmployee({id: this.employeeId}));

    this.activatedRoute.queryParams.subscribe(param => {
      if (param.isUpdate) {
        this.updateEmployee();
      }
    });
  }

  get employeeId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  updateEmployee(): void {
    this.isOpen = true
  }

  deleteEmployee(employee: Employee, leftAt?: Date): void {
    this.dialog.open(DeleteEmployeeComponent, {
      width: 'fit-content',
      data: {employee, leftAt}
    });
  }

  addAndUpdateRelative(
    employeeId: number,
    id?: number,
    relative?: Relative
  ): void {
    this.dialog.open(AddRelativeComponent, {
      disableClose: true,
      width: '60%',
      data: {employeeId: employeeId, id: id, relative: relative}
    });
  }

  deleteRelative(id: number, employeeId: number) {
    this.dialog.open(DialogDeleteComponent, {
      disableClose: true,
      width: '30%'
    }).afterClosed().subscribe((val) => {
      if (val) {
        this.store.dispatch(
          EmployeeAction.deleteRelative({id: id, employeeId: employeeId})
        );
      }
    });
  }

  addAndUpdateDegree(employeeId: number, id?: number, degree?: Degree) {
    this.dialog.open(AddDegreeComponent, {
      disableClose: true,
      width: '40%',
      data: {employeeId: employeeId, id: id, degree: degree}
    });
  }

  deleteDegree(id: number, employeeId: number) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '30%'
    });
    dialogRef.afterClosed().subscribe((val) => {
      if (val) {
        this.store.dispatch(
          EmployeeAction.deleteDegree({id: id, employeeId: employeeId})
        );
      }
    });
  }

  addOrUpdateBHYT(bhyt?: any) {
    this.dialog.open(DevelopmentComponent, {width: '30%'});
    // this.dialog.open(BHYTComponent, {
    //   width: '50%',
    //   data: {bhyt, update: !!bhyt}
    //
    //
    // });
  }

  updateContract(employee: Employee) {
    this.dialog.open(UpdateContractComponent, {width: '30%', data: employee});
  }

  historySalary(employee: Employee) {
    this.router.navigate(['phieu-luong/lich-su-luong', employee.id],
      {queryParams: {name: employee.lastName}}).then();
  }

  deleteWorkHistory(workHistory: WorkHistory, employeeId: number) {
    console.log(workHistory)
    this.dialog.open(DialogSharedComponent, {
      width: 'fit-content',
      data: {
        title: 'Xoá lịch sử công tác',
        description: 'Bạn có chắc chắn muốn xoá lịch sử công tác này không'
      }
    }).afterClosed()
      .subscribe(val => {
        if (val) {
          this.store.dispatch(EmployeeAction.deleteWorkHistory({id: workHistory.id, employeeId}))
        }
      })
  }

  eventEmit(event: boolean) {
    if (event) {
      this.isOpen = false;
    }
  }
}
