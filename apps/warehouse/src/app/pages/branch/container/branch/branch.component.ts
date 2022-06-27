import {Component, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import {Actions} from "@datorama/akita-ng-effects";
import {BranchActions, BranchEntity, BranchQuery, BranchStore} from "@minhdu-fontend/orgchart-v2";
import {NzModalService} from "ng-zorro-antd/modal";
import {ModalBranchComponent} from "../../components";
import {BranchStatusConstant} from "../../constants/branch-status.constant";

@Component({
  templateUrl: 'branch.component.html'
})
export class BranchComponent implements OnInit {
  branches$ = this.branchQuery.selectAll()
  loading$ = this.branchQuery.select(state => state.loading)

  branchStatusConstant = BranchStatusConstant
  stateSearch = this.branchQuery.getValue().search
  formGroup = new UntypedFormGroup({
    search: new UntypedFormControl(this.stateSearch?.search || ''),
    status: new UntypedFormControl(this.stateSearch?.status || ''),
    position: new UntypedFormControl(this.stateSearch?.position || ''),
  });
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    private readonly branchQuery: BranchQuery,
    private readonly branchStore: BranchStore,
    private readonly actions$: Actions,
    private readonly modal: NzModalService,
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(BranchActions.loadAll({}))

    this.formGroup.valueChanges.pipe(debounceTime(1500)).subscribe(val => {
      this.actions$.dispatch(BranchActions.loadAll(this.mapBranch(val)));
    });
  }

  mapBranch(value: any) {
    this.branchStore.update(state => ({
      ...state, search: value
    }))
    return value
  }

  onAdd() {
    this.modal.create({
      nzWidth: '30vw',
      nzTitle: 'Thêm chi nhánh',
      nzContent: ModalBranchComponent,
      nzFooter: []
    })
  }

  onUpdate(branch: BranchEntity) {
    this.modal.create({
      nzWidth: '30vw',
      nzTitle: 'Cập nhật chi nhánh',
      nzContent: ModalBranchComponent,
      nzComponentParams: <{ data?: { update?: { branch: BranchEntity } } }>{
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
      nzTitle: `Xoá chi nhánh ${branch.name}`,
      nzContent: `Bạn có chắc chắn muốn xoá chi nhánh ${branch.name} này không`,
      nzOkDanger: true,
      nzOnOk: () => this.actions$.dispatch(BranchActions.remove({id: branch.id})),
      nzFooter: []
    })
  }
}
