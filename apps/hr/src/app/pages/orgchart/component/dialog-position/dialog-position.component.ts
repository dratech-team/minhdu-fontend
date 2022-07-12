import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { select, Store } from '@ngrx/store';
import {
  PositionActions,
  selectPositionAdded,
} from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { Branch } from '@minhdu-fontend/data-models';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { searchAutocomplete } from '@minhdu-fontend/utils';
import { startWith } from 'rxjs/operators';
import * as lodash from 'lodash';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  templateUrl: 'dialog-position.component.html',
})
export class DialogPositionComponent implements OnInit {
  formGroup!: UntypedFormGroup;
  submitted = false;
  branchId!: number;
  branches = new UntypedFormControl();
  branches$ = this.store.pipe(select(getAllOrgchart));
  branchesSelected: Branch[] = [];

  constructor(
    private readonly dialogRef: MatDialogRef<DialogPositionComponent>,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly store: Store,
    private readonly message: NzMessageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.store.dispatch(OrgchartActions.init());
    if (this.data?.isUpdate) {
      if (this.data.position?.branches) {
        this.branchesSelected = [...this.data.position.branches];
      }
      this.branchId = this.data.position.branchId;
      this.formGroup = this.formBuilder.group({
        position: [this.data.position.name],
        workday: [this.data.position.workday],
      });
    } else {
      this.formGroup = this.formBuilder.group({
        position: [undefined, Validators.required],
        workday: [undefined, Validators.required],
      });
    }
    this.branches$ = searchAutocomplete(
      this.branches.valueChanges.pipe(startWith(this.data?.branch?.name || '')),
      this.branches$
    );
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onsubmit(): any {
    this.submitted = true;
    if (this.formGroup.valid) {
      if (this.branches.value) {
        return this.message.error('Đơn vị phải chọn không được nhập');
      }
      const val = this.formGroup.value;
      if (this.data?.isUpdate) {
        this.store.dispatch(
          PositionActions.updatePosition({
            id: this.data.position.id,
            name: val.position,
            workday: val.workday,
            branchIds: this.branchesSelected.map((val) => val.id),
          })
        );
      } else {
        this.store.dispatch(
          PositionActions.addPosition({
            name: val.position,
            workday: val.workday,
            branchIds: this.branchesSelected.map((val) => val.id),
          })
        );
      }
    } else {
      return;
    }
    this.store.pipe(select(selectPositionAdded)).subscribe((added) => {
      if (added) {
        this.dialogRef.close();
      }
    });
  }

  selectBranch(branch: Branch) {
    this.branchId = branch.id;
  }

  onSelectBranch(event: any, branch: Branch, branchesInput: HTMLInputElement) {
    if (event.isUserInput) {
      if (branch.id) {
        if (this.branchesSelected.some((item) => item.id === branch.id)) {
          this.message.success('Đơn vị đã được chọn');
        } else {
          this.branchesSelected.push(branch);
        }
      }
      setTimeout(() => {
        this.branches.setValue('');
        branchesInput.blur();
      });
    }
  }

  removeBranchSelected(branch: Branch) {
    lodash.remove(this.branchesSelected, branch);
  }
}
