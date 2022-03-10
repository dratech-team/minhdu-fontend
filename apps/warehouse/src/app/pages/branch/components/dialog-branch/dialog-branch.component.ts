import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {OrgchartActions} from "@minhdu-fontend/orgchart";

@Component({
  templateUrl: 'dialog-branch.component.html'
})
export class DialogBranchComponent implements OnInit {
  formGroup!: FormGroup
  submitted = false

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
  ) {
  }

  ngOnInit() {
    if (this.data.isUpdate) {
      this.formGroup = this.formBuilder.group({
        name: [this.data.branch.name, Validators.required],
        phone: [this.data.branch?.phone],
        address: [this.data.branch?.address],
        status: [this.data.branch?.status],
      })
    } else {
      this.formGroup = this.formBuilder.group({
        name: ['', Validators.required],
        phone: [],
        address: [],
        status: [],
      })
    }
  }

  onSubmit() {
    this.submitted = true
    if (this.formGroup.invalid) {
      return
    }
    const value = this.formGroup.value
    const branch = {
      name: value.name,
      phone: value?.phone,
      address: value?.address,
      status: value?.status
    }
    if (this.data?.isUpdate) {
      this.store.dispatch(OrgchartActions.addBranch({branch: branch}))
    } else {
      this.store.dispatch(OrgchartActions.updateBranch({id: this.data.branch.id, updateBranchDto: branch}))
    }
  }
}
