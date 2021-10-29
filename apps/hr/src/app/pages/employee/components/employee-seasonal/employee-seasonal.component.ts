import {
  Component,
  Inject,
  LOCALE_ID,
  OnInit,
  ViewChild,
  ElementRef, Input
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { FlatSalary, RecipeType } from '@minhdu-fontend/enums';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { DatePipe } from '@angular/common';
import {
  getAllPosition,
  PositionActions
} from 'libs/orgchart/src/lib/+state/position';
import { EmployeeAction, selectEmployeeAdded } from '@minhdu-fontend/employee';
import { Branch, Position } from '@minhdu-fontend/data-models';
import { map, startWith } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PositionService } from '../../../../../../../../libs/orgchart/src/lib/services/position.service';
import { BranchService } from '../../../../../../../../libs/orgchart/src/lib/services/branch.service';
import { checkInputNumber } from '../../../../../../../../libs/utils/checkInputNumber.util';
import { searchAndAddAutocomplete } from '../../../../../../../../libs/utils/autocomplete.ultil';

@Component({
  selector: 'app-employee-seasonal',
  templateUrl: 'employee-seasonal.component.html'
})
export class EmployeeSeasonalComponent implements OnInit {
  @Input() data: any;
  formGroup!: FormGroup;
  submitted = false;
  recipeType = RecipeType;

  constructor(
    public datePipe: DatePipe,
    @Inject(LOCALE_ID) private locale: string,
    private readonly formBuilder: FormBuilder,
    private readonly snackbar: MatSnackBar,
    private readonly store: Store<AppState>,
    private readonly dialogRef: MatDialogRef<EmployeeSeasonalComponent>
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      identify: [this.data?.employee?.identify],
      issuedBy: [this.data?.employee?.issuedBy],
      idCardAt: [
        this.datePipe.transform(this?.data?.employee?.idCardAt, 'yyyy-MM-dd')
      ],
      firstName: [this.data?.employee?.firstName, Validators.required],
      lastName: [this.data?.employee?.lastName, Validators.required],
      address: [this.data?.employee?.address, Validators.required],
      gender: [this.data?.employee?.gender, Validators.required],
      recipeType: [this.recipeType.CT3],
      note: [this.data?.employee?.note]
    });
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }

    const value = this.formGroup.value;
    const employee = {
      id: this?.data?.employee?.id,
      firstName: value.firstName,
      lastName: value.lastName,
      gender: value.gender,
      identify: value?.identify?.toString(),
      idCardAt: value.idCardAt ? new Date(value.idCardAt) : undefined,
      issuedBy: value.issuedBy,
      address: value.address,
      recipeType: value.recipeType,
      note: value.note
    };
    if (this.data !== null) {
      this.store.dispatch(
        EmployeeAction.updateEmployee({
          id: this.data.employee.id,
          employee: employee
        })
      );
    } else {
      this.store.dispatch(EmployeeAction.addEmployee({ employee: employee }));
    }

    this.store.pipe(select(selectEmployeeAdded)).subscribe((added) => {
      if (added) {
        this.dialogRef.close();
      }
    });
  }

  checkInputNumber(event: any) {
    return checkInputNumber(event);
  }
}
