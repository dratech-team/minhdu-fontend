import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {getBranchAdded, OrgchartActions} from "@minhdu-fontend/orgchart";
import {Actions} from "@datorama/akita-ng-effects";
import {ProviderActions} from "../../state/provider.action";
import {ProviderQuery} from "../../state/provider.query";

@Component({
  templateUrl: 'dialog-provider.component.html'
})
export class DialogProviderComponent implements OnInit {
  formGroup!: FormGroup
  submitted = false

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly providerQuery: ProviderQuery,
    private readonly dialogRef: MatDialogRef<DialogProviderComponent>,
  ) {
  }

  ngOnInit() {
    if (this.data?.isUpdate) {
      this.formGroup = this.formBuilder.group({
        name: [this.data.provider.name, Validators.required],
        phone: [this.data.provider?.phone],
        email: [this.data.provider?.email],
      })
    } else {
      this.formGroup = this.formBuilder.group({
        name: ['', Validators.required],
        phone: [],
        email: [],
      })
    }
  }

  onSubmit() {
    this.submitted = true
    if (this.formGroup.invalid) {
      return
    }
    const value = this.formGroup.value
    const provider = {
      name: value.name,
      phone: value?.phone,
      email: value?.address,
    }
    if (this.data?.isUpdate) {
      this.actions$.dispatch(ProviderActions.update({id: this.data.provider.id, body: provider}))
    } else {
      this.actions$.dispatch(ProviderActions.addOne(provider))
    }

    this.providerQuery.select(state => state.added).subscribe(added => {
      if (added) {
        this.dialogRef.close()
      }
    })
  }

  get checkValid() {
    return this.formGroup.controls;
  }
}
