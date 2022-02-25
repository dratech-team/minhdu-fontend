import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DatePipe} from "@angular/common";
import {select, Store} from "@ngrx/store";
import {EggTypeQuery} from "../../../egg-type/state/egg-type.query";
import {Actions} from "@datorama/akita-ng-effects";
import {EggTypeActions} from "../../../egg-type/state/egg-type.action";
import {Branch} from "@minhdu-fontend/data-models";
import {searchAndAddAutocomplete} from "@minhdu-fontend/utils";
import {startWith} from "rxjs/operators";
import {of} from "rxjs";
import {IncubatorFactoryActions} from "../../state/incubator-factory.action";
import {getAllOrgchart, OrgchartActions} from "@minhdu-fontend/orgchart";

@Component({
  templateUrl: 'add-egg.component.html'
})
export class AddEggComponent implements OnInit {
  eggType$ = this.eggTypeQuery.selectAll()
  branches$ = this.storeNgrx.pipe(select(getAllOrgchart));

  formGroup!: FormGroup;
  branchId?: number
  submitted = false
  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly dialogRef: MatDialogRef<AddEggComponent>,
    private readonly storeNgrx: Store,
    private readonly eggTypeQuery: EggTypeQuery,
    private readonly action$: Actions,
  ) {
  }

  ngOnInit() {
    this.branchId = this.data?.branch?.id

    this.storeNgrx.dispatch(OrgchartActions.init());

    this.action$.dispatch(EggTypeActions.loadAll())

    this.formGroup = this.formBuilder.group({
      amount: ['',Validators.required],
      eggType: ['', Validators.required],
      createdAt: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required],
      branches: [this.data?.branch?.name]
    })

    this.branches$ = searchAndAddAutocomplete(
      this.formGroup.get('branches')?.valueChanges.pipe(startWith('')) || of(''),
      this.branches$
    );
  }

  onSelectBranch(event: any, branch: Branch) {
    if (event.isUserInput) {
      this.branchId = branch.id;
    }
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    this.submitted = true
    const value = this.formGroup.value
    if (this.formGroup.invalid) {
      return;
    }
    if (!this.branchId) {
      return this.snackbar.open('Chưa chọn đơn vị', '', {duration: 1500})
    }
    this.action$.dispatch(IncubatorFactoryActions.addEgg({
      branchId: this.branchId,
      createdAt: new Date(),
      amount: value.amount,
      eggTypeId: value.eggType,
    }))
    this.closePopup()
  }

  closePopup() {
    this.dialogRef.close()
  }
}
