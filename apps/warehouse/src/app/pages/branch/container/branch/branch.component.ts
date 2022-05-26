import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {OrgchartActions} from '@minhdu-fontend/orgchart';
import {debounceTime} from 'rxjs/operators';
import {Actions} from "@datorama/akita-ng-effects";
import {BranchActions, BranchEntity, BranchQuery} from "@minhdu-fontend/orgchart-v2";
import {
  ModalBranchComponent
} from "../../../../../../../hrv2/src/app/pages/orgchart/branch/components/modal-branch/modal-branch.component";
import {DataAddOrUpBranch} from "../../../../../../../hrv2/src/app/pages/orgchart/branch/data/modal-department.data";
import {NzModalService} from "ng-zorro-antd/modal";

@Component({
  templateUrl: 'branch.component.html'
})
export class BranchComponent implements OnInit {
  branches$ = this.branchQuery.selectAll()
  loading$ = this.branchQuery.select(state => state.loading)

  formGroup = new FormGroup({
    search: new FormControl(),
    status: new FormControl(-1)
  });

  constructor(
    private readonly branchQuery: BranchQuery,
    private readonly actions$: Actions,
    private readonly modal: NzModalService
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(BranchActions.loadAll({}))
    this.formGroup.valueChanges.pipe(debounceTime(1500)).subscribe(val => {
      this.actions$.dispatch(OrgchartActions.searchBranch({ search: val?.search, status: val?.status }));
    });
  }

  mapBranch(value: any){

  }

  onAdd() {
    this.modal.create({
      nzWidth: '30vw',
      nzTitle: 'Thêm đơn vị',
      nzContent: ModalBranchComponent,
      nzFooter: []
    })
  }

  onUpdate(branch: BranchEntity) {
    this.modal.create({
      nzWidth: '30vw',
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

  onDelete(branch: BranchEntity) {
    this.modal.warning({
      nzTitle: `Xoá đơn vị ${branch.name}`,
      nzContent: `Bạn có chắc chắn muốn xoá đơn vị ${branch.name} này không`,
      nzOkDanger: true,
      nzOnOk: () => this.actions$.dispatch(BranchActions.remove({id: branch.id})),
      nzFooter: []
    })
  }
}
