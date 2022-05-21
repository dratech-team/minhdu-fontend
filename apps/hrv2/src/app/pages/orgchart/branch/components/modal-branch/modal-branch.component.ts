import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzModalRef} from "ng-zorro-antd/modal";
import {Actions} from "@datorama/akita-ng-effects";
import {BranchActions, BranchQuery, PositionActions, PositionEntity, PositionQuery} from "@minhdu-fontend/orgchart-v2";
import {DataAddOrUpBranch} from "../../data/modal-department.data";
import {BaseAddBranchDto, BaseUpdateBranchDto} from "../../../../../../../../../libs/orgchart-v2/src/lib/branch/dto";

@Component({
  templateUrl: 'modal-branch.component.html'
})
export class ModalBranchComponent implements OnInit {
  @Input() data?: DataAddOrUpBranch

  positions$ = this.positionQuery.selectAll()
  added$ = this.branchQuery.select(state => state.added)

  formGroup!: FormGroup;
  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);

  constructor(
    private readonly modalRef: NzModalRef,
    private readonly actions$: Actions,
    private readonly formBuilder: FormBuilder,
    private readonly positionQuery: PositionQuery,
    private readonly branchQuery: BranchQuery,
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(PositionActions.loadAll({}));
    const branch = this.data?.update?.branch
    this.formGroup = this.formBuilder.group({
      name: [branch?.name || '', Validators.required],
      positions: [branch?.positions || []]
    });
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onsubmit(): any {
    if (this.formGroup.invalid) {
      return
    }
    const branch = this.mapBranch()
    this.actions$.dispatch(
      this.data?.update
        ? BranchActions.update({id: this.data.update.branch.id, updates: branch})
        : BranchActions.addOne({body: branch})
    )
    this.added$.subscribe(val => {
      if (val) {
        this.modalRef.close()
      }
    })
  }

  private mapBranch(): Partial<BaseAddBranchDto> | Partial<BaseUpdateBranchDto> {
    const value = this.formGroup.value
    return {
      name: value.name,
      positionIds: value.positions.map((position: PositionEntity) => position.id)
    }
  }
}
