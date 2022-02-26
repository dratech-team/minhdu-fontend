import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { EggTypeQuery } from '../../../egg-type/state/egg-type.query';
import { Actions } from '@datorama/akita-ng-effects';
import { EggTypeActions } from '../../../egg-type/state/egg-type.action';
import { Branch } from '@minhdu-fontend/data-models';
import { searchAndAddAutocomplete } from '@minhdu-fontend/utils';
import { startWith } from 'rxjs/operators';
import { of } from 'rxjs';
import { IncubatorFactoryActions } from '../../state/incubator-factory.action';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { IncubatorFactoryStore } from '../../state/incubator-factory.store';
import { IncubatorFactoryQuery } from '../../state/incubator-factory.query';

@Component({
  templateUrl: 'add-egg.component.html'
})
export class AddEggComponent implements OnInit {
  eggType$ = this.eggTypeQuery.selectAll();
  branches$ = this.storeNgrx.pipe(select(getAllOrgchart));

  formGroup!: FormGroup;
  submitted = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly datePipe: DatePipe,
    private readonly snackbar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<AddEggComponent>,
    private readonly storeNgrx: Store,
    private readonly eggTypeQuery: EggTypeQuery,
    private readonly eggQuery: IncubatorFactoryQuery,
    private readonly action$: Actions,
    private readonly eggStore: IncubatorFactoryStore
  ) {
  }

  ngOnInit() {

    this.storeNgrx.dispatch(OrgchartActions.init());
    this.action$.dispatch(EggTypeActions.loadAll());

    this.formGroup = this.formBuilder.group({
      amount: ['', Validators.required],
      eggType: ['', Validators.required],
      createdAt: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required],
      branch: ['', Validators.required]
    });

    this.branches$ = searchAndAddAutocomplete(
      this.formGroup.get('branches')?.valueChanges.pipe(startWith('')) || of(''),
      this.branches$
    );
  }

  onSelectBranch(branch: Branch) {
    if (branch) {
      this.eggStore.update(state => ({ ...state, branchId: branch.id }));
    }
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    this.submitted = true;
    const value = this.formGroup.value;
    if (this.formGroup.invalid) {
      return;
    }
    // if (!this.branchId) {
    //   return this.snackbar.open('Chưa chọn đơn vị', '', { duration: 1500 });
    // }
    this.action$.dispatch(IncubatorFactoryActions.addEgg({
      branchId: this.eggQuery.getValue().branchId,
      createdAt: new Date(),
      amount: value.amount,
      eggTypeId: value.eggType
    }));
    this.dialogRef.close();
  }
}
