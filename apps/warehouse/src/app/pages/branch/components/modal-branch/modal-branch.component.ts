import { Component, Input, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Actions } from '@datorama/akita-ng-effects';
import {
  BranchActions,
  BranchEntity,
  BranchQuery,
} from '@minhdu-fontend/orgchart-v2';
import {
  BaseAddBranchDto,
  BaseUpdateBranchDto,
} from '../../../../../../../../libs/orgchart-v2/src/lib/branch/dto';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  templateUrl: 'modal-branch.component.html',
})
export class ModalBranchComponent implements OnInit {
  @Input() data?: { update?: { branch: BranchEntity } };

  loading$ = this.branchQuery.select((state) => state.loading);

  formGroup!: UntypedFormGroup;
  submitted = false;

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly action: Actions,
    private readonly branchQuery: BranchQuery,
    private readonly modalRef: NzModalRef
  ) {}

  ngOnInit() {
    const branch = this.data?.update?.branch;
    this.formGroup = this.formBuilder.group({
      name: [branch?.name, Validators.required],
      phone: [branch?.phone],
      address: [branch?.address],
      status: [branch?.status],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const branch = this.mapBranch(this.formGroup.value);

    this.action.dispatch(
      this.data?.update
        ? BranchActions.update({
            id: this.data.update.branch.id,
            updates: branch,
          })
        : BranchActions.addOne({ body: branch })
    );

    this.loading$.subscribe((loading) => {
      if (loading === false) {
        this.modalRef.close();
      }
    });
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  private mapBranch(value: any): BaseAddBranchDto | BaseUpdateBranchDto {
    return {
      name: value.name,
      phone: value?.phone,
      address: value?.address,
      status: value?.status,
    };
  }
}
