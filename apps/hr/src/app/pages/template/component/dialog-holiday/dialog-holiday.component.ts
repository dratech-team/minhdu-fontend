import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../reducers';
import {HolidayAction} from '../../+state/holiday/holiday.action';
import {getAllPosition, PositionActions} from '@minhdu-fontend/orgchart-position';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Position} from '@minhdu-fontend/data-models';
import {selectHolidayAdded} from '../../+state/holiday/holiday.selector';


@Component({
  templateUrl: 'dialog-holiday.component.html'
})
export class DialogHolidayComponent implements OnInit {
  @ViewChild('positionInput') inputPosition!: ElementRef;
  numberChars = new RegExp('[^0-9]', 'g');
  submitted = false;
  formGroup!: FormGroup;
  positions$ = this.store.pipe(select(getAllPosition));
  formPosition = new FormControl()
  positions = new FormControl('');
  hidePrice = true;
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);
  constructor(
    public datePipe: DatePipe,
    private readonly formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly store: Store<AppState>,
    private readonly dialogRef: MatDialogRef<DialogHolidayComponent>,
    private readonly snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this.store.dispatch(PositionActions.loadPosition());
    if (this.data?.holiday) {
      if (this.data.holiday.positions) {
        this.formPosition.setValue([...this.data.holiday.positions])
      }
      this.hidePrice = this.data.holiday.rate <= 1;
      this.formGroup = this.formBuilder.group({
        name: [this.data?.holiday?.name, Validators.required],
        datetime: [
          this.data?.isUpdate?
          this.datePipe.transform(
            this.data?.holiday?.datetime, 'yyyy-MM-dd'
          ) : '',
          Validators.required],
        rate: [this.data?.isUpdate ? this.data.holiday.rate : 1, Validators.required],
        isConstraint: [this.data?.isUpdate ? this.data?.holiday?.isConstraint : true],
        price: [this.data?.holiday?.price]
      });
    }else{
      this.formGroup = this.formBuilder.group({
        name: ['', Validators.required],
        datetime: ['', Validators.required],
        rate: ['', Validators.required],
        isConstraint: [true],
        price: ['']
      });
    }

    this.formPosition.valueChanges.subscribe(val => {
      console.log(val)
    })

    this.formGroup.get('rate')?.valueChanges.subscribe(
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
    if(this.formPosition.value.length === 0){
      return this.snackBar.open('Chưa chọn chức vụ')
    }
    const val = this.formGroup.value;
    const holiday = {
      name: val.name,
      datetime: val.datetime,
      rate: val.rate,
      positionIds: this.formPosition.value.map((val:Position) => val.id),
      isConstraint: val.isConstraint,
      price: val.rate <= 1
        ? typeof val.price === 'string'
          ? Number(val.price.replace(this.numberChars, ''))
          : val.price
        : undefined
    };
    if (this.data?.isUpdate) {
      this.store.dispatch(HolidayAction.UpdateHoliday({
        id: this.data.holiday.id, holiday: holiday, updateDetail: this.data.updateDetail
      }));
    } else {
      this.store.dispatch(HolidayAction.AddHoliday({holiday: holiday}));
    }
    this.store.pipe(select(selectHolidayAdded)).subscribe(added => {
      if (added) {
        this.dialogRef.close();
      }
    });
  }
}
