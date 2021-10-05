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
import { map, startWith } from 'rxjs/operators';
import { selectHolidayAdded } from '../../+state/holiday/holiday.selector';


@Component({
  templateUrl: 'add-holiday.component.html'
})
export class AddHolidayComponent implements OnInit {
  @ViewChild('positionInput') inputPosition!: ElementRef;
  numberChars = new RegExp('[^0-9]', 'g');
  submitted = false;
  formGroup!: FormGroup;
  positions$ = this.store.pipe(select(getAllPosition));
  positions = new FormControl('');
  positionSelected: Position[] = [];
  hidePrice = true;

  constructor(
    public datePipe: DatePipe,
    private readonly formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly store: Store<AppState>,
    private readonly dialogRef: MatDialogRef<AddHolidayComponent>,
    private readonly snackBar: MatSnackBar,
    private readonly positionService: PositionService
  ) {
  }

  ngOnInit() {
    this.store.dispatch(PositionActions.loadPosition());
    if (this.data) {
      if (this.data.positions) {
        this.positionSelected = [...this.data.positions];
      }
      this.hidePrice = this.data.rate <= 1;
      console.log(this.hidePrice);
    }

    this.store.dispatch(PositionActions.loadPosition());
    this.formGroup = this.formBuilder.group({
      name: [this.data?.name, Validators.required],
      datetime: [
        this.datePipe.transform(
          this.data?.datetime, 'yyyy-MM-dd'
        ),
        Validators.required],
      rate: [this.data ? this.data.rate : 1, Validators.required],
      isConstraint: [this.data ? this.data?.isConstraint : true],
      price: [this.data?.price]
    });
    this.positions$ = combineLatest([
      this.positions.valueChanges.pipe(startWith('')),
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
    this.formGroup.get('rate')!.valueChanges.subscribe(
      rate => this.hidePrice = rate <= 1
    );
  }

  get f() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    if (this.positionSelected.length === 0) {
      return this.snackBar.open('chưa chọn chức vụ', '', { duration: 2000 });
    }
    const val = this.formGroup.value;
    const holiday = {
      name: val.name,
      datetime: val.datetime,
      rate: val.rate,
      positionIds: this.positionSelected.map(val => val.id),
      isConstraint: val.isConstraint,
      price: val.rate <= 1
        ? typeof val.price === 'string'
          ? Number(val.price.replace(this.numberChars, ''))
          : val.price
        : undefined
    };
    if (this.data) {
      this.store.dispatch(HolidayAction.UpdateHoliday({ id: this.data?.id, holiday: holiday }));
    } else {
      this.store.dispatch(HolidayAction.AddHoliday({ holiday: holiday }));
    }
    this.store.pipe(select(selectHolidayAdded)).subscribe(added => {
      if (added) {
        this.dialogRef.close();
      }
    });
  }

  onCreatePosition(position: any): any {
    if (position.id) {
      if (this.positionSelected.filter(item => item.id === position.id).length > 0) {
        this.snackBar.open('chức vụ đã được chọn', '', { duration: 1000 });
      } else {
        this.positionSelected.push(position);
      }
    } else {
      this.positionService
        .addOne({
          name: this.inputPosition.nativeElement.value
        })
        .subscribe((position) => (
          this.positionSelected.push(position)
        ));
      this.snackBar.open('Đã tạo', '', { duration: 2500 });
    }
    this.positions.setValue('');
  }

  removePosition(position: Position) {
    lodash.remove(this.positionSelected, position);
  }
}
