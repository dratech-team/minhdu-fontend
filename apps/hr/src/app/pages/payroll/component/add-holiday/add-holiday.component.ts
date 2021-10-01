import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { HolidayAction } from '../../+state/holiday/holiday.action';
import { getAllPosition, PositionActions } from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Position } from '@minhdu-fontend/data-models';
import * as lodash from 'lodash';
import { PositionService } from '../../../../../../../../libs/orgchart/src/lib/services/position.service';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectHolidayAdded } from '../../+state/holiday/holiday.selector';


@Component({
  templateUrl: 'add-holiday.component.html'
})
export class AddHolidayComponent implements OnInit {
  @ViewChild('positionInput') inputPosition!: ElementRef;
  submitted = false;
  formGroup!: FormGroup;
  positions$ = this.store.pipe(select(getAllPosition));
  positions = new FormControl();
  positionSelected: Position[] = [];

  constructor(
    public datePipe: DatePipe,
    private readonly formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly store: Store<AppState>,
    private readonly dialogRef: MatDialogRef<AddHolidayComponent>,
    private readonly snackbar: MatSnackBar,
    private readonly positionService: PositionService
  ) {
  }

  ngOnInit() {
    if(this.data?.positions){
      this.positionSelected = [...this.data.positions]
    }
    this.store.dispatch(PositionActions.loadPosition());
    this.formGroup = this.formBuilder.group({
      name: [this.data?.name, Validators.required],
      datetime: [
        this.datePipe.transform(
          this.data?.datetime, 'yyyy-MM-dd'
        ),
        Validators.required],
      rate: [this.data?.rate, Validators.required],
    });
    this.positions$ = combineLatest([
      this.positions.valueChanges,
      this.positions$
    ]).pipe(
      map(([position, positions]) => {
        if (position) {
          const result = positions.filter((e) => {
            return e.name.toLowerCase().includes(position?.toLowerCase());
          });
          if (!result.length) {
            result.push({ id: 0, name: 'Tạo mới chức vụ' });
          }
          return result;
        } else {
          return positions;
        }
      })
    );
  }

  get f() {
    return this.formGroup.controls;
  }

  onSubmit() {
    this.store.dispatch(PositionActions.loadPosition());
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const val = this.formGroup.value;
    const holiday = {
      name: val.name,
      datetime: val.datetime,
      rate: val.rate,
      positionIds: this.positionSelected.map(val => val.id),
    };
    if (this.data) {
      this.store.dispatch(HolidayAction.UpdateHoliday({ id: this.data?.id, holiday: holiday }));
    } else {
      this.store.dispatch(HolidayAction.AddHoliday({ holiday: holiday }));
    }
    this.store.pipe(select(selectHolidayAdded)).subscribe(added => {
      if(added){
        this.dialogRef.close();
      }
    })
  }

  onCreatePosition(position: any) {
    if (position.id) {
      if (this.positionSelected.includes(position)) {
        throw this.snackbar.open('chức vụ đã được chọn', '', { duration: 1000 });
      }
      this.positionSelected.push(position);
    } else {
      this.positionService
        .addOne({
          name: this.inputPosition.nativeElement.value
        })
        .subscribe((position) => (
          this.positionSelected.push(position)
        ));
      this.snackbar.open('Đã tạo', '', { duration: 2500 });
    }
    this.positions.setValue('');
  }

  removePosition(position: Position) {
    lodash.remove(this.positionSelected, position);
  }
}
