import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterOverviewEnum, OptionOverviewEnum } from '@minhdu-fontend/enums';
import * as dateFns from 'date-fns';

@Component({
  selector: 'select-statical',
  templateUrl: 'select-statistical.component.html'
})
export class SelectStatisticalComponent implements OnInit {
  @Input() type!: FilterOverviewEnum;
  @Output() onExport = new EventEmitter<any>();
  @Output() onChangeValue = new EventEmitter<any>();

  thisMonth = [dateFns.startOfMonth(new Date()), dateFns.endOfMonth(new Date())];

  ranges = {
    'Hôm nay': [new Date(), new Date()],
    'Tháng này': this.thisMonth,
    '3 Tháng gần nhất': [dateFns.startOfMonth(dateFns.subMonths(new Date(), 3)), dateFns.endOfMonth(new Date())],
    'Năm nay': [dateFns.startOfYear(new Date()), dateFns.endOfYear(new Date())],
    'Năm trước': [dateFns.startOfYear(dateFns.subYears(new Date(), 1)), dateFns.endOfYear(new Date())]
  };

  optionOverview = OptionOverviewEnum;
  filterOverview = FilterOverviewEnum;

  formGroup = new FormGroup({
    option: new FormControl<OptionOverviewEnum>(OptionOverviewEnum.SALES, { validators: Validators.required }),
    range: new FormControl<Date[]>(this.thisMonth, { validators: Validators.required })
  });

  ngOnInit() {
    this.formGroup.valueChanges.subscribe((value) => {
      if (value.range?.length === 0) {
        this.formGroup.controls.range.setValue(this.thisMonth);
      }
      if ((value.range?.length === 2 && value.range[0] && value.range[1])) {
        this.onChangeValue.emit({
          option: value.option,
          startedAt: new Date(value.range[0]),
          endedAt: new Date(value.range[1])
        });
      }
    });
  }

  // print() {
  //   const val = this.formGroup.value;
  //   const params = {
  //     startedAt: val.startedAt,
  //     endedAt: val.endedAt,
  //     option: val.option,
  //     print: true
  //   };
  //   this.onExport.emit(params);
  // }
}
