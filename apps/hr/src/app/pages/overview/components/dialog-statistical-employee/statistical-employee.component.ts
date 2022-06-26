import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { startWith } from 'rxjs/operators';
import { Branch } from '@minhdu-fontend/data-models';
import { searchAutocomplete } from '../../../../../../../../libs/utils/orgchart.ultil';

@Component({
  templateUrl: 'statistical-employee.component.html'
})
export class StatisticalEmployeeComponent implements OnInit {
  branches = new UntypedFormControl();
  formGroup!: UntypedFormGroup;
  submitted = false;
  branches$ = this.store.pipe(select(getAllOrgchart));
  branchId!: number
  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly store: Store,
    private readonly snackbar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<StatisticalEmployeeComponent>,
  ) {
  }

  ngOnInit() {
    this.store.dispatch(OrgchartActions.init());
    this.formGroup = this.formBuilder.group({
      startedAt: [undefined, Validators.required],
      endedAt: [undefined, Validators.required],
      }
    );
    this.branches$ = searchAutocomplete(
      this.branches.valueChanges.pipe(startWith('')),
      this.branches$
    );
  }
  get checkValid(){
    return this.formGroup.controls;
  }

  onSubmit() : any {
    this.submitted = true
    if(this.formGroup.invalid){
      return
    }else{
      this.dialogRef.close()
    }
  }

  onselectBranch(event: any, branch: Branch) {
    if (event.isUserInput) {
        this.branchId = branch.id;
    }
  }
}
