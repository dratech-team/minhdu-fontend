import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterOverviewEnum, OptionOverviewEnum, StatisticalYType } from '@minhdu-fontend/enums';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Employee } from '@minhdu-fontend/data-models';
import { getFirstDayInMonth, getLastDayInMonth } from '../../../../../../../../libs/utils/daytime.until';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-pick-statical',
  templateUrl: 'pick-statistical-type.component.html'
})
export class PickStatisticalTypeComponent implements OnInit {
  @Input() type!: FilterOverviewEnum
  @Output() EventPrint = new EventEmitter<any>();
  @Output() EventStatistical = new EventEmitter<any>();
  optionOverview = OptionOverviewEnum;
  filterOverview = FilterOverviewEnum;
  formGroup!: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly datePipe: DatePipe,
    private readonly snackbar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      option: [this.optionOverview.SALES, Validators.required],
      startedAt: [undefined, Validators.required],
      endedAt: [ undefined,Validators.required]
    });
    this.formGroup.valueChanges.subscribe(val => {
      if((val.startedAt && val.endedAt)||(!val.startedAt && !val.endedAt) ){
        this.EventStatistical.emit(val)
      }
    })
  }

  print() {
    const val = this.formGroup.value;
    const params = {
      startedAt: val.startedAt,
      endedAt: val.endedAt,
      option: val.option,
      print: true
    };
    this.EventPrint.emit(params);
  }
}
