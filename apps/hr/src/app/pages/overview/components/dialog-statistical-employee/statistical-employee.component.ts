import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { searchAndAddAutocomplete, searchAutocomplete } from '../../../../../../../../libs/utils/autocomplete.ultil';
import { startWith } from 'rxjs/operators';
import { Branch } from '@minhdu-fontend/data-models';

@Component({
  templateUrl: 'statistical-employee.component.html'
})
export class StatisticalEmployeeComponent implements OnInit {
  branches = new FormControl();
  formGroup!: FormGroup;
  submitted = false;
  branches$ = this.store.pipe(select(getAllOrgchart));
  branchId!: number
  constructor(
    private readonly formBuilder: FormBuilder,
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
      console.log(this.branchId)
    }
  }
}