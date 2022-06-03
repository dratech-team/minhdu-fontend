import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Salary, WorkHistory} from '@minhdu-fontend/data-models';
import {DegreeLevelEnum, DegreeStatusEnum, ModeEnum, RecipeType} from '@minhdu-fontend/enums';
import {RecipeSalaryConstant} from "../../../../../../../../libs/constants/HR/recipe-salary.constant";
import {NzModalService} from "ng-zorro-antd/modal";
import {EmployeeActions, EmployeeEntity, EmployeeQuery} from "@minhdu-fontend/employee-v2";
import {Actions} from "@datorama/akita-ng-effects";
import {FormalityTypeConstant} from "../../constants/formality-type.constant";
import {DegreeTypeConstant} from "../../constants/degree-type.constant";
import {RelationshipConstant} from "../../constants/relationship.constant";
import {GenderTypeConstant} from "@minhdu-fontend/constants";
import {DegreeLevelTypeConstant} from "../../constants/degree-level-type.constant";
import {DegreeStatusTypeConstant} from "../../constants/degree-status-type.constant";
import {ModalEmployeeComponent} from "../../components/employee/modal-employee.component";
import {ModalEmployeeData} from "../../data/modal-employee.data";
import {RelativeEntity} from "../../../../../../../../libs/employee-v2/src/lib/employee/entities/relative.entity";
import {ModalRelativeComponent} from "../../components/relative/modal-relative.component";
import {ModalRelative} from "../../data/modal-relative.data";
import {ModalDegreeComponent} from "../../components/degree/modal-degree.component";
import {ModalDegreeData} from "../../data/modal-degree.data";
import {DegreeEntity} from "../../../../../../../../libs/employee-v2/src/lib/employee/entities/degree.entity";
import {ModalDatePickerComponent, TransformConstantPipe} from "@minhdu-fontend/components";
import {ModalUpdateContractComponent} from "../../components/modal-update-contract/modal-update-contract.component";
import {ContractEntity} from "../../../../../../../../libs/employee-v2/src/lib/employee/entities/contract.entity";
import {ModalDatePickerEntity} from "@minhdu-fontend/base-entity";

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
  degreeLevelTypeConstant = DegreeLevelTypeConstant
  degreeStatusTypeConstant = DegreeStatusTypeConstant
  recipeConstant = RecipeSalaryConstant


  status = DegreeStatusEnum;
  level = DegreeLevelEnum;
  recipeType = RecipeType;
  modeDev = false

  constructor(
    private readonly actions$: Actions,
    private readonly employeeQuery: EmployeeQuery,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly modal: NzModalService,
    private readonly transformConstantPipe: TransformConstantPipe
  ) {
  }

  ngOnInit(): void {
    this.actions$.dispatch(EmployeeActions.loadOne({id: this.employeeId}));
    this.activatedRoute.queryParams.subscribe(param => {
      const employee = this.employeeQuery.getEntity(this.employeeId)
      if (param.isUpdate && employee) {
        this.onUpdate(employee);
      }
      if (param?.mode === ModeEnum.DEV) {
        this.modeDev = true
      }
    });
  }

  get employeeId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  onUpdate(employee: EmployeeEntity): void {
    this.modal.create({
      nzWidth: '700px',
      nzTitle: 'Cập nhật nhân viên',
      nzContent: ModalEmployeeComponent,
      nzComponentParams: <{ data: ModalEmployeeData }>{
        data: {
          update: {
            employee
          }
        }
      },
      nzFooter: []
    })
  }

  onDelete(employee: EmployeeEntity): void {
    this.modal.create({
      nzTitle: `Tạm thời nghỉ việc`,
      nzContent: ModalDatePickerComponent,
      nzComponentParams: <{ data: ModalDatePickerEntity }>{
        data: {
          type: 'date',
          dateInit: new Date(),
        }
      },
      nzFooter: []
    }).afterClose.subscribe(val => {
      if (val) {
        this.actions$.dispatch(EmployeeActions.leave({
            id: employee.id,
            body: {leftAt: new Date(val)}
          })
        )
        this.onEmployee()
      }
    })
  }

  onRestore(employee: EmployeeEntity) {
    this.modal.info({
      nzTitle: `Khôi phục nhân viên ${employee.lastName}`,
      nzContent: `Bạn có chắc chắn muốn khôi phục cho nhân viên ${employee.lastName}`,
      nzOnOk: () => {
        this.actions$.dispatch(
          EmployeeActions.leave({
            id: employee.id,
            body: {leftAt: ''}
          })
        )
        this.onEmployee()
      }
    })
  }

  onRelative(employeeId: number, id?: number, relative?: RelativeEntity): void {
    this.modal.create({
      nzWidth: '700px',
      nzTitle: relative ? 'Cập nhật người thân' : 'Thêm người thân',
      nzContent: ModalRelativeComponent,
      nzComponentParams: <{ data: ModalRelative }>{
        data: {
          employeeId: employeeId,
          update: {
            relative: relative
          }
        }
      },
      nzFooter: []
    })
  }

  onDeleteRelative(relative: RelativeEntity) {
    this.modal.warning({
      nzTitle: 'Xoá người thân',
      nzContent: `Bạn có chắc chắn muốn xoá
      ${this.transformConstantPipe.transform(relative.relationship, RelationshipConstant)} là
      ${relative.lastName}
       này không`,
      nzOkDanger: true,
      nzOnOk: () => this.actions$.dispatch(EmployeeActions.removeRelative({
        id: relative.id,
        employeeId: relative.employeeId
      }))
    })
  }

  onDegree(employeeId: number, id?: number, degree?: DegreeEntity) {
    this.modal.create({
      nzTitle: degree ? 'Cập nhật bằng cấp' : 'Thêm bằng cấp',
      nzContent: ModalDegreeComponent,
      nzComponentParams: <{ data: ModalDegreeData }>{
        data: {
          employeeId: employeeId,
          update: {
            degree: degree
          }
        }
      },
      nzFooter: []
    })
  }

  onDeleteDegree(degree: DegreeEntity) {
    this.modal.warning({
      nzTitle: 'Xoá bằng cấp',
      nzContent: `Bạn có chắc chắn muốn xoá bằng
      ${this.transformConstantPipe.transform(degree.type, DegreeTypeConstant)} này không`,
      nzOkDanger: true,
      nzOnOk: () => this.actions$.dispatch(EmployeeActions.removeDegree({id: degree.id, employeeId: degree.employeeId}))
    })
  }

  onBHYT(bhyt?: any) {
  }

  onUpdateContract(employee: EmployeeEntity) {
    this.modal.create({
      nzTitle: 'Cập nhật hợp đồng',
      nzContent: ModalUpdateContractComponent,
      nzComponentParams: <{ data: { employeeId: number, contracts: ContractEntity [] } }>{
        data: {
          contracts: employee.contracts,
          employeeId: employee.id
        }
      },
      nzFooter: []
    })
  }

  onHistorySalary(employee: EmployeeEntity) {
    this.router.navigate(['phieu-luong/lich-su-luong', employee.id],
      {queryParams: {name: employee.lastName}}).then();
  }

  onDeleteWorkHistory(workHistory: WorkHistory, employeeId: number) {
    this.modal.warning({
      nzTitle: 'Xoá lịch sử công tác',
      nzContent: 'bạn có chắc chắn xoá lịch sử công tác này không',
      nzOkDanger: true,
      nzOnOk: () => {
        this.actions$.dispatch(EmployeeActions.removeWorkHistory({
          id: workHistory.id,
          employeeId: employeeId
        }))
      }
    })
  }

  onUpdateHistorySalary(salary: Salary) {
  }

  onDeleteHistorySalary(salary: Salary) {
  }

  private onEmployee() {
    this.employeeQuery.select(state => state.deleted).subscribe(val => {
        if (val) {
          this.router.navigate(['nhan-vien']).then()
        }
      }
    );

  }
}
