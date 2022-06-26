import {Component, Input, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {BranchActions, BranchEntity, BranchQuery, PositionActions, PositionQuery} from "@minhdu-fontend/orgchart-v2";
import {NzModalRef} from "ng-zorro-antd/modal";
import {DataAddOrUpdatePosition} from "../../data/modal-position.data";
import {Actions} from "@datorama/akita-ng-effects";
import {
  BaseAddPositionDto,
  BaseUpdatePositionDto
} from "../../../../../../../../../libs/orgchart-v2/src/lib/position/dto";

@Component({
  templateUrl: 'modal-position.component.html'
})
export class ModalPositionComponent implements OnInit {
  @Input() data?: DataAddOrUpdatePosition

  branches$ = this.branchQuery.selectAll()
  loading$ = this.positionQuery.select(state => state.loading)
  formGroup!: UntypedFormGroup;

  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2)

  constructor(
    private readonly actions$: Actions,
    private readonly modalRef: NzModalRef,
    private readonly branchQuery: BranchQuery,
    private readonly positionQuery: PositionQuery,
    private readonly formBuilder: UntypedFormBuilder,
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
    this.loading$.subscribe(loading => {
      if (loading === false) {
        this.modalRef.close()
      }
    })
  }

  mapPosition(): BaseAddPositionDto | BaseUpdatePositionDto {
    const value = this.formGroup.value;
    return {
      name: value.name,
      workday: value.workday,
      branchIds: value.branches.map((val: BranchEntity) => val.id)
    }
  }
}
