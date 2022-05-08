import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BranchActions, BranchEntity, BranchQuery, PositionActions} from "@minhdu-fontend/orgchart-v2";
import {NzModalRef} from "ng-zorro-antd/modal";
import {DataAddOrUpdatePosition} from "../../data/modal-position.data";
import {Actions} from "@datorama/akita-ng-effects";

@Component({
  templateUrl: 'modal-position.component.html'
})
export class ModalPositionComponent implements OnInit {
  @Input() data?: DataAddOrUpdatePosition

  branches$ = this.branchQuery.selectAll()
  added$ = this.branchQuery.select(state => state.added)
  formGroup!: FormGroup;

  constructor(
    private readonly actions$: Actions,
    private readonly modalRef: NzModalRef,
    private readonly branchQuery: BranchQuery,
    private readonly formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(BranchActions.loadAll({}))
    const position = this.data?.update?.position
    this.formGroup = this.formBuilder.group({
      name: [position?.name],
      workday: [position?.workday],
      branches: [position?.branches || []]
    });
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onsubmit(): any {
    if (this.formGroup.invalid) {
      return
    }
    const position = this.mapPosition()
    this.actions$.dispatch(
      this.data?.update
        ? PositionActions.update({id: this.data.update.position.id, updates: position})
        : PositionActions.addOne({body: position})
    )
    this.added$.subscribe(val => {
      if (val) {
        this.modalRef.close()
      }
    })
  }

  mapPosition() {
    const value = this.formGroup.value;
    return {
      name: value.name,
      workday: value.workday,
      branchIds: value.branches.map((val: BranchEntity) => val.id)
    }
  }
}
