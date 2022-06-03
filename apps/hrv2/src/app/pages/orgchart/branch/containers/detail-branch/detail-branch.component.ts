import {Component, OnInit} from '@angular/core';
import {ModeEnum, OrgchartEnum} from '@minhdu-fontend/enums';
import {FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Actions} from "@datorama/akita-ng-effects";
import {BranchActions, BranchEntity, BranchQuery} from "@minhdu-fontend/orgchart-v2";
import {NzModalService} from "ng-zorro-antd/modal";
import {ModalBranchComponent} from "../../components/modal-branch/modal-branch.component";
import {DataAddOrUpBranch} from "../../data/modal-department.data";
import {ModalAlertComponent} from "@minhdu-fontend/components";
import {ModalAlertEntity} from "@minhdu-fontend/base-entity";
import {AllowanceBranchComponent} from "../../components/modal-allowance-branch/allowance-branch.component";
import {DataAddOrUpAllowanceBranch} from "../../data/modal-allowance-branch.data";
import {AllowanceBranchEntity} from "../../entities/allowance-branch.entity";

@Component({
  templateUrl: 'detail-branch.component.html'
})
export class DetailBranchComponent implements OnInit {
  branch$ = this.branchQuery.selectEntity(this.branchId);
  type = OrgchartEnum;
  pageSize = 30;
  pageIndexInit = 0;
  branch = new FormControl();
  modeDebug = false

  constructor(
    private readonly actions$: Actions,
    private readonly branchQuery: BranchQuery,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly modal: NzModalService,
    private readonly activeRouter: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.activeRouter.queryParams.subscribe(val => {
      if (val?.mode === ModeEnum.DEV) {
        this.modeDebug = true
      }
    })

    this.actions$.dispatch(BranchActions.loadOne({id: this.branchId}));
  }

  onAddAllowance(branch: BranchEntity) {
    this.modal.create({
      nzTitle: `Thêm phụ cấp cho đơn vị`,
      nzContent: AllowanceBranchComponent,
      nzComponentParams: <{ data: DataAddOrUpAllowanceBranch }>{
        data: {
          add: {
            branch: branch
          }
        }
      },
      nzFooter: []
    })
  }

  onUpdateAllowance(allowance: AllowanceBranchEntity) {
    this.modal.create({
      nzTitle: `Cập nhật phụ cấp cho đơn vị`,
      nzContent: AllowanceBranchComponent,
      nzComponentParams: <{ data: DataAddOrUpAllowanceBranch }>{
        data: {
          update: {
            allowance: allowance
          }
        }
      },
      nzFooter: []
    })
  }

  updateBranch(branch: BranchEntity) {
    this.modal.create({
      nzTitle: 'Cập nhật đơn vị',
      nzContent: ModalBranchComponent,
      nzComponentParams: <{ data?: DataAddOrUpBranch }>{
        data: {
          update: {
            branch: branch
          }
        }
      },
      nzFooter: []
    })
  }

  get branchId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  onDelete(branch: BranchEntity) {
    this.modal.create({
      nzTitle: `Xoá đơn vị ${branch.name}`,
      nzContent: ModalAlertComponent,
      nzComponentParams: <{ data: ModalAlertEntity }>{
        data: {
          description: `Bạn có chắc chắn muốn xoá đơn vị ${branch.name} này không`
        }
      },
      nzFooter: []
    }).afterClose.subscribe(val => {
      if (val) {
        this.actions$.dispatch(BranchActions.remove({id: branch.id}))
        this.branchQuery.select(state => state.deleted).subscribe(val => {
          if (val) {
            this.router.navigate(['to-chuc']).then()
          }
        })
      }
    })
  }

  deleteAllowance(allowance: AllowanceBranchEntity) {
    this.modal.create({
      nzTitle: `Xoá Phụ cấp  ${allowance.title}`,
      nzContent: ModalAlertComponent,
      nzComponentParams: <{ data: ModalAlertEntity }>{
        data: {
          description: `Bạn có chắc chắn muốn xoá phụ cấp${allowance.title} này không`
        }
      },
      nzFooter: []
    }).afterClose.subscribe(val => {
      if (val) {
        this.actions$.dispatch(BranchActions.deleteAllowance({salaryId: allowance.id}))
      }
    })
  }

  onListPosition(id: number) {
    this.router.navigate(['to-chuc/chuc-vu']).then()
  }
}
